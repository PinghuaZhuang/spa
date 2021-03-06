let common = { name: 'common' };

const SPACE_RGE = /\s+|,\s*|\|\s*|-\s*/;

/**
 * 判断是否为普通对象
 */
function isPlainObject( obj ) {
    let key;

    if ( obj == null || typeof obj !== 'object' || obj.nodeType || common.isWindow( obj ) ) return false;

    for ( key in obj ) { }

    return key === undefined || Object.hasOwnProperty.call( obj, key );
}

/**
 * 判断是否为 window 对象
 */
function isWindow( obj ) {
    return obj != null && obj == obj.window;
}


/**
 * 扩展对象函数, 默认为深拷贝
 */
common.extend = function () {
	var src, copyIsArray, copy, name, options, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = true;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !(typeof obj === 'function') ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && Array.isArray( src ) ? src : [];

					} else {
						clone = src && isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = common.extend( deep, clone, copy )

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	return target;
};

common.extend({

    isPlainObject,
	isWindow,
	SPACE_RGE,

    /* 判断是否为数组 */
    isArray: Array.isArray,

    /* 获取对象类型 */
    type: function( obj ) {
		if ( obj == null ) return obj + "";
		return typeof obj;
	},

	/* 转换数据为对象 */
	parse( res ) {
		let data;
		try {
			data = JSON.parse(res);
		} catch (err) {

			res = res.replace(/:"{/g, ":{");
			res = res.replace(/}",/g, "},");
			res = res.replace(/}"}/g, "}}");
			res = res.replace(/\\/g, "");
			try {
				data = JSON.parse( res );
			} catch (error) {
				console.error("RES 数据解析失败：" + error.message)
			}
		}
		return data;
	},

	// 缓存长度
	cacheLength: 100,

	/* 缓存 */
	createCache() {
		var keys = [];

		function cache( key, value ) {
			// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
			if ( keys.push( key + " " ) > common.cacheLength ) {
				// Only keep the most recent entries
				delete cache[ keys.shift() ];
			}
			return (cache[ key + " " ] = value);
		}
		return cache;
	},

	/* 创建选项 */
	createOption( keys ) {
		let option = {};
		keys.split( SPACE_RGE ).forEach( el => option[ el ] = true );
		return option;
	},

	/* 驼峰命名转 html 规范命名 */
	hyphenate( name ) {
		return name
			.replace( /([A-Z])/g, '-$1' )
			.toLowerCase()
			.replace( /^-/, '' );
	},
});


/* 工具函数 */
export default common;