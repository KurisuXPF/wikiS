window.onload=function(){
var app = angular.module('xdsWikiApp', ['ngAnimate']);
app.controller('xdsMain', function($scope, $http, $timeout) {
    var form = $('form');
    var close = $('.fdj');
    var input = $('input');
    var search = $("#search");
    var help = $("#help");

    $scope.results = [];
    close.on('click', function() {// 通过fdj类实现切换显示/隐藏 搜索框
    form.toggleClass('open');//通过对form元素添加/取消 open类实现具体的显示

    if (!form.hasClass('open') && $scope.searchTxt !== '' && typeof $scope.searchTxt !== 'undefined') {//通过判断是否已经搜索显示结果区域和隐藏帮助
    search.toggleClass('fullHeight')
    help.toggleClass('hide');
    $scope.searchTxt = '';
    }
    $scope.results = [];//初始化结果接受对象
    $scope.$apply();
    })
    input.on('transitionend webkitTransitionEnd oTransitionEnd', function() {
    if (form.hasClass('open')) {
    input.focus();
    } else {
    return;
    }
    })
    $scope.search = function() {//实际搜索的处理
    $scope.results = [];
    help.addClass('hide');
    search.removeClass('fullHeight');
    var title = input.val();//获取搜索的主题
    var api = 'http://zh.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';//api接口
    var cb = '&callback=JSON_CALLBACK';//回调接口定义
    var page = 'http://zh.wikipedia.org/?curid=';//用于展示结果的基础URL部分

    $http.jsonp(api + title + cb)
    .success(function(data) {
    var results = data.query.pages;
    angular.forEach(results, function(v,k)  {
    $scope.results.push({title: v.title, body: v.extract, page: page + v.pageid})//结果推入接收器数组，注意，在数组不为空后，是利用angular的自动机制进行页面填充的，即根据 <a ng-href="{{result.page}}" target="_blank" ng-repeat="result in results">属性进行填充的。
    })
    });
    }
    });
};