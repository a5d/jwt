const {Router} = require('express')

const router = Router()

router.use((req, res) => {
  const user = req.body

  try {
    req.db.find({email: user.email}).limit(1).toArray((err1, users) => {
      if (err1) {
        res.status(400).json({error: err1})
        return
      }

      if (users.length > 0) {
        res.status(400).json({error: 'Email already use'})
        return
      }

      req.db.insertOne(user, (err2) => {
        if (err2) {
          res.status(400).json({error: 'Insert Error'})
          return
        }

        res.json({msg: 'Registered'})
      })
    })

  } catch (err) {
    res.status(400).json({error: err.message})
  }
})

module.exports = router