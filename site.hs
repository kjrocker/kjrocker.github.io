--------------------------------------------------------------------------------
{-# LANGUAGE OverloadedStrings #-}

-- import Data.Monoid (mappend)
import Data.ByteString.Char8 (pack)
import Data.ByteString.Lazy (fromStrict)
import Data.Digest.Pure.MD5 (md5)
import Hakyll

--------------------------------------------------------------------------------
main :: IO ()
main = hakyll $ do
  match "images/*" $ do
    route idRoute
    compile copyFileCompiler

  compiledStylesheetPath <- preprocess $ do
    styles <- mapM readFile styleSheets
    let h = md5 $ fromStrict $ pack $ compressCss $ mconcat styles
    pure $ "css/" <> show h <> ".css"

  let cssPathCtx = constField "cssPath" compiledStylesheetPath

  create [fromFilePath compiledStylesheetPath] $ do
    route idRoute
    compile $ do
      styles <- mapM (load . fromFilePath) styleSheets
      let ctx = listField "styles" defaultContext (pure styles)
      makeItem "" >>= loadAndApplyTemplate "templates/all.css" ctx

  match "css/*" $ do
    route idRoute
    compile compressCssCompiler

  match (fromList ["about.markdown"]) $ do
    route $ setExtension "html"
    compile $
      pandocCompiler
        >>= loadAndApplyTemplate "templates/static.html" defaultContext
        >>= loadAndApplyTemplate "templates/default.html" (cssPathCtx <> defaultContext)
        >>= relativizeUrls

  match "posts/*" $ do
    route $ setExtension "html"
    compile $
      pandocCompiler
        >>= saveSnapshot "content"
        >>= loadAndApplyTemplate "templates/post.html" postCtx
        >>= loadAndApplyTemplate "templates/default.html" (cssPathCtx <> defaultContext)
        >>= relativizeUrls

  create ["archive.html"] $ do
    route idRoute
    compile $ do
      posts <- recentFirst =<< loadAll "posts/*"
      let archiveCtx =
            listField "posts" postCtx (return posts)
              `mappend` constField "title" "Archives"
              `mappend` (cssPathCtx <> defaultContext)

      makeItem ""
        >>= loadAndApplyTemplate "templates/archive.html" archiveCtx
        >>= loadAndApplyTemplate "templates/default.html" archiveCtx
        >>= relativizeUrls

  match "404.html" $ do
    route idRoute
    compile $
      pandocCompiler
        >>= loadAndApplyTemplate "templates/static.html" defaultContext
        >>= loadAndApplyTemplate "templates/default.html" (cssPathCtx <> defaultContext)

  match "index.html" $ do
    route idRoute
    compile $ do
      posts <- fmap (take 10) . recentFirst =<< loadAll "posts/*"
      let indexCtx =
            listField "posts" postCtx (return posts)
              `mappend` cssPathCtx
              <> defaultContext

      getResourceBody
        >>= applyAsTemplate (teaserField "teaser" "content" <> indexCtx)
        >>= loadAndApplyTemplate "templates/default.html" indexCtx
        >>= relativizeUrls

  match "templates/*" $ compile templateBodyCompiler

--------------------------------------------------------------------------------
postCtx :: Context String
postCtx =
  dateField "date" "%B %e, %Y"
    `mappend` (teaserField "teaser" "content" <> defaultContext)

styleSheets :: [FilePath]
styleSheets =
  [ "css/style.css",
    "css/tango.css",
    "css/espresso.css"
  ]