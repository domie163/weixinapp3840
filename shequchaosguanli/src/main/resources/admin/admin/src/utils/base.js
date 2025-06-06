const base = {
    get() {
        return {
            url : "http://localhost:8080/shequchaosguanli/",
            name: "shequchaosguanli",
            // 退出到首页链接
            indexUrl: 'http://localhost:8080/shequchaosguanli/front/index.html'
        };
    },
    getProjectName(){
        return {
            projectName: "社区超市管理系统"
        } 
    }
}
export default base
