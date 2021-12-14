const bcrypt = require('bcryptjs')
const db = require('../models')
const User = db.User
const Favorite = db.Favorite
const Like = db.Like

const helpers = require('../_helpers')

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },
  signUp: (req, res) => {
    // confirm password
    if (req.body.passwordCheck !== req.body.password) {
      req.flash('error_messages', 'Password and Password Check inconsistent')
      return res.redirect('/signup')
    } else {
      // confirm unique user
      User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
          req.flash('error_messages', 'This email has already sign up')
          return res.redirect('/signup')
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            req.flash('success_messages', 'Sign up successfully!')
            return res.redirect('/signin')
          })
        }
      })
    }
  },
  signInPage: (req, res) => {
    return res.render('signin')
  },
  signIn: (req, res) => {
    req.flash('success_messages', 'Log in successfully')
    res.redirect('/restaurants')
  },
  logout: (req, res) => {
    req.flash('success_messages', 'Log out successfully')
    req.logout()
    res.redirect('/signin')
  },
  addFavorite: async (req, res) => {
    await Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId
    })
    return res.redirect('back')
  },
  removeFavorite: async (req, res) => {
    await Favorite.destroy({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId
      }
    })
    return res.redirect('back')
  },
  addLike: async (req, res) => {
    await Like.create({
      UserId: helpers.getUser(req).id,
      RestaurantId: req.params.restaurantId
    })
    return res.redirect('back')
  },
  removeLike: async (req, res) => {
    await Like.destroy({
      where: {
        UserId: helpers.getUser(req).id,
        RestaurantId: req.params.restaurantId
      }
    })
    return res.redirect('back')
  }
}

module.exports = userController