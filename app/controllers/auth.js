function login(req, res) {
  const { username, password } = req.body;
  let response = { token: username };
  res.json();
}

function register(req, res) {
  const data = req.body;
}

function logout(req, res) {
  const data = req.body;
}

let authController = { login, register, logout };
module.exports = authController;
