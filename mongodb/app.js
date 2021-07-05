//新建一个users表，并且只有需要一条数据

const express = require('express')
const app = express()
const port = 3000
const md5 = require('md5')
const mongoose = require('mongoose')
//连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/script',{
    useNewUrlParser: true,
    useUnifiedTopology: true
})


//建立schema
const userSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        required: false,
        default:0
    }
})
const Model = mongoose.model("User",userSchema,"users")


// app.use(express.json())
//接收post数据
app.use(express.urlencoded({extended: false}))

//自定义中间件加密密码
app.use((req,res,next) => {
    // console.log(req.body.password);
    // console.log(md5(md5(req.body.password) + md5(req.body.password).substr(10,10)));
    req.body.password = md5(md5(req.body.password) + md5(req.body.password).substr(10,10))
    next()
})
// app.post('/init', (req, res) => {
//     console.log(req.body);
// })

app.post('/login',(req,res) =>{
    let data = req.body
    // console.log(data);
    //查询数据库，检查是否有这个用户
    Model.findOne(data).then((ret) => {
        // console.log(ret);
        if(ret === null){
            //没有用户就输入json数据，告诉用户
            res.send({error_code:1000,message:"账号或密码错误"})
        }else{
            //有这个用户（签发jwt）
            res.send({
                error_code:0,
                message:'ok',
                // _token:
            })
        }
    })
})
app.listen(port, () => console.log(`http://127.0.0.1:3000`))

