/**
 * @typedef Setting
 * @type {Object}
 * @property {Window|HTMLElement} root - 스크롤 이벤트가 바인드 되는 영역.
 * @property {Number} activePercentY 진입 체크 시작 포인트(Y)
 * @property {Number} deActivePercentY 진입 체크 엔드 포인드(Y)
 * @property {Number} activePercentX 진입 체크 시작 포인트(X)
 * @property {Number} deActivePercentX 진입 체크 엔드 포인드(X)
 * @property {Number} activeDelay 진입시 해당 시간 후 함수 실행됨.
 * @property {Number} threshold intersectionObserve 의 threshold
 * @property {null|function} direct 진입했을때 대기 없이 바로 실행 되는 callback
 * @property {null|function} active 진입했을때 실행될 callback
 * @property {null|function} deActive 나갔을때 실행될 callback
 * @property {null|function} scroll 스크롤 될때 실행될 callback
 * @property {boolean} init 최초 init 을 할지 옵션
 * @property {string|number} checkY top|middle|bottom|custom number(px),target 의 기준점.
 * @property {string|number} checkX left|center|right|custom number(px)
 */
/**
 * 메인 class.
 * 새로운 스크롤 감시자를 생성한다.
 * @class
 */
export default class ElementScrollWatcher {
    /**
     * @method
     * 기본적인 동작을 컨트롤 한다.
     * init 시에 window.scroll 에 해당 함수를 바인딩 한다.
     * 만약 scroll 을 사용하지 않고 임의의 가상 스크롤을 만들어 내는 경우, 해당 스크롤러의 callback 에서 mot() 가 실행 되도록 한다.
     * option.scroll callback 이 있을 경우 실행 한다.
     */
    static mot(): void;
    /**
     * @constructor
     * @param {String|HTMLElement|HTMLCollection} elements String = selector ex) `.element` or `#id`
     * @param {Setting} setting
     */
    constructor(elements: string | HTMLElement | HTMLCollection, setting?: Setting);
    /**
     * element 의 dataset.eswId 값을 체크하여 object 를 리턴함.
     * @param {HTMLElement} element
     * @returns {{element:HTMLElement, id:String, esw:Object}}
     * 인자로 받은 element 의 dataset 값을 참조 하여 내장 EswItem 을 함께 리턴.
     */
    getEswObj(element: HTMLElement): {
        element: HTMLElement;
        id: string;
        esw: any;
    };
    /**
     * @method
     * 최초 객체를 셋업한다.
     * init 이 된 상태라면 추가로 동작 하지 않는다.
     */
    init(): void;
    boundMot: any;
    isInit: boolean;
    /**
     * 동적으로 element 가 생성 된 경우 사용.
     * @param {HTMLCollection|HTMLElement|String} elements String = selector ex) `.element` or `#id`
     */
    update(elements: HTMLCollection | HTMLElement | string): void;
    items: any;
    /**
     * 해당 클래스를 비활성화 한다.
     */
    disable(): void;
    isDisable: boolean;
    /**
     * 해당 클래스를 활성화 한다.
     */
    enable(): void;
    /**
     * 해당 클래스를 영구적으로 제거 한다.
     */
    destroy(): void;
}
export type Setting = {
    /**
     * - 스크롤 이벤트가 바인드 되는 영역.
     */
    root: Window | HTMLElement;
    /**
     * 진입 체크 시작 포인트(Y)
     */
    activePercentY: number;
    /**
     * 진입 체크 엔드 포인드(Y)
     */
    deActivePercentY: number;
    /**
     * 진입 체크 시작 포인트(X)
     */
    activePercentX: number;
    /**
     * 진입 체크 엔드 포인드(X)
     */
    deActivePercentX: number;
    /**
     * 진입시 해당 시간 후 함수 실행됨.
     */
    activeDelay: number;
    /**
     * intersectionObserve 의 threshold
     */
    threshold: number;
    /**
     * 진입했을때 대기 없이 바로 실행 되는 callback
     */
    direct: null | Function;
    /**
     * 진입했을때 실행될 callback
     */
    active: null | Function;
    /**
     * 나갔을때 실행될 callback
     */
    deActive: null | Function;
    /**
     * 스크롤 될때 실행될 callback
     */
    scroll: null | Function;
    /**
     * 최초 init 을 할지 옵션
     */
    init: boolean;
    /**
     * top|middle|bottom|custom number(px),target 의 기준점.
     */
    checkY: string | number;
    /**
     * left|center|right|custom number(px)
     */
    checkX: string | number;
};
