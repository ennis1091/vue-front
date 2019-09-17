module.exports = {
  presets: [
    '@vue/app'
  ],
  plugins: [
        [
          "import",
          { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
        ],
        // element官方教程
        [
          "component",
          {
            libraryName: "element-ui",
            styleLibraryName: "theme-chalk"
          }
        ]
    ],
    
}
