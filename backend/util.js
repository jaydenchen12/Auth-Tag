module.exports = {
  getToken: function(token){
    if (token.startsWith("Bearer ")){
       return token.substring(7, token.length);
  } else {
       return null;
   }
  }
}
