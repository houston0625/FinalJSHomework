/*
 * 數字轉千分位、千分位轉換回數字
 */
let ConvertCommaUtility = {

    /**
     * 將數字轉為千分位
     * @param {any} item 傳控制項進來
     */
    ConvertNumberByItem: function (item) {
        let length = 14;

        var originalValue = $.trim($(item).val()).length > length ?
            $.trim($(item).val()).substr(0, length) :
            $.trim($(item).val());

        originalValue = ConvertCommaUtility.RemoveComma(originalValue);

        $(item).val(ConvertCommaUtility.AppendComma(originalValue));
    },

    /**
     * 數字處理為有千分位
     * @param {any} n
     */
    AppendComma: function (n) {

        var strNumber = n + '';

        var arr = strNumber.split('.');

        var firstNumber = parseInt(arr[0]);

        if (!/^((-*\d+)|(0))$/.test(firstNumber)) {
            var newValue = /^((-*\d+)|(0))$/.exec(firstNumber);
            if (newValue !== null) {
                if (parseInt(newValue, 10)) {
                    firstNumber = newValue;
                } else {
                    return '0';
                }
            } else {
                return '0';
            }
        }
        if (parseInt(firstNumber, 10) === 0) {
            return '0';
        }

        var re = /(\d{1,3})(?=(\d{3})+$)/g;

        let decimalPoint = arr[1] + '';
        if (decimalPoint.length > 2) {
            decimalPoint = decimalPoint.slice(0, 2);
        }

        //return arr[0].replace(re, '$1,') + (arr.length === 2 ? '.' + decimalPoint : '');

        // 小數點以下不保留
        return arr[0].replace(re, '$1,');
    },

    /**
     * 數字處理為有千分位(保留小數點)
     * @param {any} n
     */
    AppendCommaHavePoint: function (n) {

        let strNumber = n + '';

        let arr = strNumber.split('.');

        let firstNumber = parseInt(arr[0]);

        if (!/^((-*\d+)|(0))$/.test(firstNumber)) {
            let newValue = /^((-*\d+)|(0))$/.exec(firstNumber);
            if (newValue !== null) {
                if (parseInt(newValue, 10)) {
                    firstNumber = newValue;
                } else {
                    return '0';
                }
            } else {
                return '0';
            }
        }
        if (parseInt(firstNumber, 10) === 0) {
            return '0';
        }

        let re = /(\d{1,3})(?=(\d{3})+$)/g;

        let decimalPoint = arr[1] + '';
        if (decimalPoint.length > 2) {
            decimalPoint = decimalPoint.slice(0, 2);
        }

        return arr[0].replace(re, '$1,') + (arr.length === 2 ? '.' + decimalPoint : '');
    },

    /*
     * 將有千分位的數值轉為一般數字(回傳型態:string)
     */
    RemoveComma: function (n) {
        return n.replace(/[,]+/g, '');
    },

    /*
     * 將有千分位的數值轉為一般數字(回傳型態:number)
     */
    RemoveCommaReturnNumberType: function (n) {
        let _number = n.replace(/[,]+/g, '');
        return parseInt(_number);
    }
}