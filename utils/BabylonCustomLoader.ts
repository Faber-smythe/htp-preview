interface ILoadingScreen {
  // What happens when loading starts
  displayLoadingUI: () => void
  // What happens when loading stops
  hideLoadingUI: () => void
  // default loader support. Optional!
  loadingUIBackgroundColor: string
  loadingUIText: string
}

export default class BabylonCustomLoader implements ILoadingScreen {
  // optional, but needed due to interface definitions
  public loadingUIBackgroundColor!: string
  public loadingUIText!: string
  loadingScreen: HTMLElement
  constructor(sceneLoadScreen: HTMLElement) {
    // this.loadingScreen = document.querySelector('.brandHolder')!
    this.loadingScreen = sceneLoadScreen
  }

  // Display loading screen
  public displayLoadingUI() {
    this.loadingScreen.style.display = 'flex'
  }

  public hideLoadingUI() {
    this.loadingScreen.style.display = 'none'
  }
}
