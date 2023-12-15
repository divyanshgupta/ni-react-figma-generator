import { STORAGE_KEYS } from './storageKeys'
import { messageTypes } from './messagesTypes'
import { UnitType } from './code-builder/buildSizeStringByUnit'
import { modifyTreeForComponent } from './modifyTreeForComponent'
import { buildCode } from './code-builder/buildCode'
import { buildTagTree } from './code-builder/buildTagTree'
import { buildCssString, CssStyle } from './code-builder/buildCssString'
import { UserComponentSetting } from './userComponentSetting'
import { TextCount } from './getCssDataForTag'
import { closeFigmaPlugin, notifyFigmaUI, showFigmUI } from './figma-utils/figmaUtils'

showFigmUI(__html__, { width: 480, height: 480 })

let selectedNodes = figma.currentPage.selection

async function generate(node: SceneNode, config: { cssStyle?: CssStyle; unitType?: UnitType }) {
  let cssStyle = config.cssStyle
  if (!cssStyle) {
    cssStyle = await figma.clientStorage.getAsync(STORAGE_KEYS.CSS_STYLE_KEY)

    if (!cssStyle) {
      cssStyle = 'css'
    }
  }

  let unitType = config.unitType
  if (!unitType) {
    unitType = await figma.clientStorage.getAsync(STORAGE_KEYS.UNIT_TYPE_KEY)

    if (!unitType) {
      unitType = 'px'
    }
  }

  const userComponentSettings: UserComponentSetting[] = (await figma.clientStorage.getAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY)) || []

  const textCount = new TextCount()

  const originalTagTree = buildTagTree(node, unitType, textCount)

  if (originalTagTree === null) {
    notifyFigmaUI('Please select a visible node')
    return
  }

  const tag = await modifyTreeForComponent(originalTagTree, figma)

  const generatedCodeStr = buildCode(tag, cssStyle)
  const cssString = buildCssString(tag, cssStyle)

  figma.ui.postMessage({ generatedCodeStr, cssString, cssStyle, unitType, userComponentSettings })
}
figma.on("selectionchange", () => { 

  selectedNodes = figma.currentPage.selection
  handleSelectionChanged()

})
const handleSelectionChanged = ()=>{
  if (selectedNodes.length > 1) {
    notifyFigmaUI('Please select only 1 node')
    closeFigmaPlugin()
  } else if (selectedNodes.length === 0) {
    notifyFigmaUI('Please select a node')
    closeFigmaPlugin()
  } else {
    generate(selectedNodes[0], {})
  }
  
}
handleSelectionChanged()


figma.ui.onmessage = (msg: messageTypes) => {
  if (msg.type === 'notify-copy-success') {
    notifyFigmaUI('copied to clipboard👍')
  }
  if (msg.type === 'new-css-style-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.CSS_STYLE_KEY, msg.cssStyle)
    generate(selectedNodes[0], { cssStyle: msg.cssStyle })
  }
  if (msg.type === 'new-unit-type-set') {
    figma.clientStorage.setAsync(STORAGE_KEYS.UNIT_TYPE_KEY, msg.unitType)
    generate(selectedNodes[0], { unitType: msg.unitType })
  }
  if (msg.type === 'update-user-component-settings') {
    figma.clientStorage.setAsync(STORAGE_KEYS.USER_COMPONENT_SETTINGS_KEY, msg.userComponentSettings)
    generate(selectedNodes[0], {})
  }
}
