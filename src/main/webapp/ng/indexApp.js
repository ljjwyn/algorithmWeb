/**
 * NG应用
 * 用于分布式画像计算，本质上是分布式聚类聚类任务
 * 2018-07-23 22:00
 * @author Wang Xiaodong
 */
var indexApp = angular.module("indexApp", []);

indexApp.filter('trustHtml', function ($sce) {

    return function (input) {

        return $sce.trustAsHtml(input);

    }

});

indexApp.filter('commentFilter', function() {
    return function(t) {
        return t.comment === "" || t.comment === null ? t.name : t.comment;
    }
});

// inspur部署时差问题
indexApp.filter('myDate', function() {
    return function(myDate) {
        return myDate;
    }
});
