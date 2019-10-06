function sender(req, res, next) {
  const user = req.user;
  const { author } = req.body;
  console.log(req.body, user);
  if (author !== user._id) return res.status(403).send("Access Forbidden!");

  next();
}

module.exports = {
  sender
};
