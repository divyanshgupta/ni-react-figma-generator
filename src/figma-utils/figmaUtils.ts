export function showFigmUI(html: any, UIProps: any) {
    figma.showUI(html, UIProps)
}

//Notify
export function notifyFigmaUI(message:string){
    figma.notify(message)
}
//Close Plugin
export function closeFigmaPlugin(){
    figma.closePlugin()
}
