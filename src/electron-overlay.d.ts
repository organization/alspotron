export declare namespace IOverlay {

    interface IHotkey{
        name: string;
        keyCode: number;
        modifiers?: {
            alt?: boolean;
            ctrl?: boolean;
            shift?: boolean;
            meta?: boolean;
        };
        passthrough?: boolean
    }

    interface IRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    interface IOverlayWindowDetails{
        name: string;
        transparent: boolean;
        resizable: boolean;
        maxWidth: number;
        maxHeight: number;
        minWidth: number;
        minHeight: number;
        rect: IRectangle;
        nativeHandle: number;
        dragBorderWidth?: number;
        caption?: {
            left: number;
            right: number;
            top: number;
            height: number;
        }
    }

    enum FpsPosition {
        TopLeft = 'TopLeft',
        TopRight = 'TopRight',
        BottomLeft = 'BottomLeft',
        BottomRight = 'BottomRight',
    }

    export interface IProcessThread {
        processId: number,
        threadId?: number;
    }

    export interface IWindow extends IProcessThread {
        windowId: number;
        title?: string;
    }

    export interface IInjectResult {
        injectHelper: string;
        injectDll: string;
        injectSucceed: boolean;
    }

    export interface ITranslateInputEvent {
      type: 'keyDown' | 'keyUp' | 'char' | 'mouseDown' | 'mouseUp' | 'mouseMove' | 'mouseWheel';
      keyCode?: string;
      modifiers: string[];
      clickCount?: number;
      deltaY?: number;
      canScroll?: boolean;
      x?: number;
      y?: number;
      button?: 'left' | 'right' | 'middle';
    }

    export function getTopWindows(includeMinimized?: boolean): IWindow[];
    export function injectProcess(process: IWindow): IInjectResult;

    export function start(): void;
    export function stop(): void;
    export function setEventCallback<T extends unknown[]>(cb: (event: string, ...args: T) => void): void;
    export function setHotkeys(hotkeys: IHotkey[]): void;
    export function sendCommand(arg: {command: 'cursor', cursor: string}): void;
    export function sendCommand(arg: {command: 'fps', showfps: boolean, position: FpsPosition}): void;
    export function sendCommand(arg: {command: 'input.intercept', intercept: boolean}): void;
    export function addWindow(windowId: number, details: IOverlayWindowDetails): void;
    export function closeWindow(windowId: number): void;
    export function sendWindowBounds(windowId: number, details: {rect: IRectangle}): void;
    export function sendFrameBuffer(windowId: number, buffer: Buffer, width: number, height: number): void;
    export function translateInputEvent(event: {windowId: number, msg: number, wparam: number, lparam: number}): ITranslateInputEvent | undefined;
}