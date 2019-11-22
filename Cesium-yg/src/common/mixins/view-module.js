import qs from 'qs'
export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true,    // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListCallBack: undefined,       // 数据列表接口，API地址
        getDataListIsPage: false, // 数据列表接口，是否需要分页？
        deleteURL: '',            // 删除接口，API地址
        deleteIsBatch: false,     // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id',   // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid...
        exportURL: '',            // 导出接口，API地址
    	templateURL: '',          // 导入模版地址
        uploadUrl: '',			  // 导入地址
        errorURL: ''			  // 错误地址
      },
      //分页属性
      pageNum: 1,               // 当前页码
      pageSize: 10,             //每页显示数目
      total: 500,               // 总条数
      // 默认属性
      dataForm: {},               // 查询条件
      dataList: [],               // 数据列表
      order: '',                  // 排序，asc／desc
      orderField: '',             // 排序，字段
      page: 1,                    
      limit: 10,                  // 每页数
      dataListLoading: false,     // 数据列表，loading状态
      dataListSelections: [],     // 数据列表，多选项
      addOrUpdateVisible: false,  // 新增／更新，弹窗visible状态
      excelImportVisible: false   // 导入，弹窗visible状态
    }
    /* eslint-enable */
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      // this.$http.get(
      //   this.mixinViewModuleOptions.getDataListURL,
      //   {
      //     params: {
      //       order: this.order,
      //       orderField: this.orderField,
      //       page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
      //       limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
      //       ...this.dataForm
      //     }
      //   }
      // ).then(({ data: res }) => {
      //   this.dataListLoading = false
      //   if (res.code !== 0) {
      //     this.dataList = []
      //     this.total = 0
      //     return this.$message.error(res.msg)
      //   }
      //   this.dataList = this.mixinViewModuleOptions.getDataListIsPage ? res.data.list : res.data
      //   this.total = this.mixinViewModuleOptions.getDataListIsPage ? res.data.total : 0
      // }).catch(() => {
      //   this.dataListLoading = false
      // })
      let params = {
              order: this.order,
              orderField: this.orderField,
              page: this.mixinViewModuleOptions.getDataListIsPage ? this.page : null,
              limit: this.mixinViewModuleOptions.getDataListIsPage ? this.limit : null,
              ...this.dataForm
          }
      this.mixinViewModuleOptions.getDataListCallBack && 
      this.mixinViewModuleOptions.getDataListCallBack(params)
      .then(res => {
        this.dataListLoading = false
        this.dataList = res
      })
    },
    // 多选
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 排序
    dataListSortChangeHandle (data) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop.replace(/([A-Z])/g, '_$1').toLowerCase()
      this.getDataList()
    },
    // 分页, 每页条数
    handleCurrentChange (val) {
      this.page = 1
      this.limit = val
      this.getDataList()
    },
    // 分页, 当前页
    pageCurrentChangeHandle (val) {
      this.page = val
      this.getDataList()
    },
    // 新增 / 修改/ 详情
    addOrUpdateHandle (id,flag) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.dataForm.flag = false
        if(flag){
        	//详情
        	this.$refs.addOrUpdate.dataForm.flag = true
        }
        this.$refs.addOrUpdate.init()
      })
    },
    // 删除
    deleteHandle (id) {
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        return this.$message({
          message: '请选择删除项',
          type: 'warning',
          duration: 500
        })
      }
      this.$confirm('确定进行删除操作?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : '/' + id}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
        ).then(({ data: res }) => {
          if (res.code !== 0) {
            return '操作成功'
          }
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 500,
            onClose: () => {
              this.getDataList()
            }
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 导出
    exportHandle () {
      var params = qs.stringify({
        ...this.dataForm
      })
      window.location.href = `${window.SITE_CONFIG['apiURL']}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
  }
}
