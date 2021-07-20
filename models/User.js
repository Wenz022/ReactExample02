const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//salt를 먼저 생성해야함 -> 생성된 salt로 비밀번호를 암호화함.
const saltRounds = 10; //10자리 salt를 만든다는 것
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

//mongoose 메소드 pre() : save 하기 전에 function 실행
userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    //비밀번호를 바꿀때만 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next(); //index.js에 있는 app.post('/register', ...) -> user.save 이전으로 보냄
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 1234567, 암호화된 비밀번호 $2b$10$bcqVRfFfb/IoDuGWOrW3R.ndB2PSoAsJFTorV1sFlBSa4jE7DEsjW
  //암호화된 비밀번호는 복호화할 수 없음.
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  var user = this;
  //jsonwebtoken을 이용해서 token을 생성하기
  var token = jwt.sign(user._id.toHexString(), "secretToken");
  /*
    user._id + 'secretToken' = token 
    -> 
    'secretToken' -> user._id
  */
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.methods.findByToken = function (token, cb) {
  var user = this;

  // user._id + 'string' = token
  //토큰을 decode 한다.
  jwt.verify(token, "secretToken", function (err, decoded) {
    // 유저 아이디를 이용해서 유저를 찾은 다음에
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
