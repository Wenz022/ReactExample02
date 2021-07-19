const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
//salt를 먼저 생성 -> salt를 이용해서 비밀번호를 암호화 해야함.
const saltRounds = 10; //salt가 몇글자인지

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

userSchema.pre("save", function (next) {
  //비밀번호를 암호화 시킨다.
  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function (err, hash) {
      //Stroe hash in your password DB.
    });
  });
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
