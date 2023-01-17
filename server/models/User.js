var bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const winston = require("winston/lib/winston/config");
const SALT_FACTOR = 10;

//schéma dans la base de données pour un utilisateur
var userSchema = mongoose.Schema({
    name:{type:String, required:[true, "Fournisser votre nom d'utilisateur"], unique:true},
    email:{type:String, required:[true, "Fournisser votre mail"], unique:true},
    password:{type:String, required:[true, "Fournissser votre mot de passe"]},
    type:{type:String,required:true},
    createdAt:{type:String, default:Date.now},
    tokens: [
        {
          token: {
            type: String,
            required: true
          }
        }
      ]
});

//cette méthode hash le password avant de le stocké dans la base de données
userSchema.pre("save", function(done){
    var user = this;
    
    if(!user.isModified("password")){
        return done();
    }

    bcrypt.genSalt(SALT_FACTOR, function(err, salt){
        if(err){ return done(err);}
        bcrypt.hash(user.password, salt, function(err, hashedPassword){
            if(err) { return done(err);}
            user.password = hashedPassword;
            done();
        });
    });
});

//cette méthode génère un token d'authentification pour l'utilisateur 
userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email },
    "polichinel", {
      expiresIn: 86400 // 24 hours
    });
    user.tokens = user.tokens.concat({ token });
    await user.save();
    return token;
  };

//Cette méthode vérifie un utilisateur par son email et son mdp
userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ 'email':email });
    if (!user) {
      return "Pas d'utilisateur dans la base de données"
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return "Mauvais mot de passe"
    }
    return user;
  };

userSchema.statics.findByEmail = async (email, name) => {
  var userDetails = await User.find({ 'name': name, 'email': email })
  if (!userDetails) {
    return "Pas d'utilisateur dans la base de données"
  }

  return userDetails;
}
userSchema.statics.findByToken = async (token) => {
  const decoded = jwt.verify(token, process.env.SECRET)
  var userDetails = await User.findOne({ _id: decoded._id, 'tokens.token': token }) 
  if (!userDetails) {
    return "Pas d'utilisateur dans la base de données"
  }
  return userDetails
}
var User = mongoose.model("User", userSchema);

module.exports = User;