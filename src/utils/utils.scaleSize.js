/**
 * 屏幕工具类
 * ui设计基准,iphone 6
 * width:750
 * height:1334
 */


import { Dimensions, PixelRatio} from 'react-native';

// 获取屏幕的dp
let screenW     = Dimensions.get('window').width;
let screenH     = Dimensions.get('window').height;
let fontScale   = PixelRatio.getFontScale();
let pixelRatio  = PixelRatio.get();

// 高保真的宽度和高度
const designWidth = 750.0;
const designHeight = 1334.0;

// 根据dp获取屏幕的px
let screenPxW = PixelRatio.getPixelSizeForLayoutSize(screenW);
let screenPxH = PixelRatio.getPixelSizeForLayoutSize(screenH);

const scaleSize = {
    size(x){
        var scaleWidth = x * screenPxW / designWidth;
        x = Math.round((scaleWidth / pixelRatio + 0.5));
        return x;
    },

    // 字体缩放，一般不用
    sizeF(size){
        var scaleWidth = screenW / designWidth;
        var scaleHeight = screenH / designHeight;
        var scale = Math.min(scaleWidth, scaleHeight);
        size = Math.round(size * scale / fontScale + 0.5);
        return size;
    },

    // 宽度缩放，同 size 
    sizeW(size) {
        var scaleWidth = size * screenPxW / designWidth;
        size = Math.round((scaleWidth / pixelRatio + 0.5));
        return size;
    },

    // 高度缩放，一般不用
    sizeH(size) {
        var scaleHeight = size * screenPxH / designHeight;
        size = Math.round((scaleHeight / pixelRatio + 0.5));
        return size;
    }
}

export {scaleSize};

