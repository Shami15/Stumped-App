//Find user by email
User.findOne({ email }).then(user => {
    // Check for user
    if (!user) {
        errors.email = "User not found";
        return res.status(404).json(errors);
    }

    //Check Password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            //User Matche

            const payload = { id: user.id, name: user.name, avatar: user.avatar }; // Create JWT Payload

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                { expiresIn: 3600 },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer  " + token
                    });
                }
            );
        } else {
            errors.password = "Password incorrect";
            return res.status(400).json(errors);
        }
    });
});


// @route Get api/users/current
//@desc Return current user
//@access Private
router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);

module.exports = router;