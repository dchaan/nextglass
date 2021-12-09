const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Collection = require('../../models/Collection');
const validateCollectionInput = require("../../validation/collections")

// get all collections from current user
// works when not using 
router.get("/", passport.authenticate("jwt", { session: false} ), (req, res) => {
  Collection
  .find({user: req.user.id})
  .sort()
  .then(collections => res.json(collections))
  .catch(err => res.status(404).json({ noCollectionsFound: "No collections found" }))
});

// get collection by id
router.get("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  const collection = Collection
    .findById(req.params.id)
    .then(collection => {
      let wines = collection.wines
      // for each tag on each wine, add to tag counter in tags
      let tags = {};
      wines.forEach(wineId => {
        Wine.find(wineId).then(wine => {
          // if tagId exists in tags, count up, o/w set to 1
          wtags.forEach(tagId =>
            tags[tagId] = tags[tagId] ? tags[tagId] + 1 : 1
          )
        })
      });

      // sort tags by counts
      let entries = Object.entries(tags)
      let sortedTags = entries.sort((a,b) => a[1] > b[1]).map(tag => tag[0])
      while (sortedTags.length < 4) {
        sortedTags.push(Math.floor(Math.random() * 56) + 1)
      }

      let primary_tag = sortedTags.slice(0, 1)
      let other_tags = sortedTags.slice(1, 4)
      // let min_price = 15 * 0.6
      // let max_price = 15 * 1.8

      return Wine.find({
        _id: { $nin: wines },
        tagIndex: { $elemMatch: { $in: primary_tag } },
        tagIndex: { $elemMatch: { $in: other_tags } },
        // price: { $gte: min_price },
        // price: { $lte: max_price },
        // points: { $gte: 1 },
        // points: { $lte: 100 }
      }).limit(10)
        .then(suggestions => (res.json({ collection, suggestions })))
        .catch(err => res.status(400).json(err))  
    })
    .catch(err => res.status(400).json(err))  
});

// create new collection 
router.post("/", passport.authenticate("jwt", {session: false}), (req, res) => {
  const { errors, isValid } = validateCollectionInput(req.body);
  if (!isValid) { return res.status(400).json(errors); };

  const newCollection = new Collection({
    user: req.user.id,
    title: req.body.title,
    description: req.body.description,
    wines: req.body.wines
  });
  newCollection
    .save()
    .then(collection => res.json(collection))
});

// update collection
router.patch("/:id", passport.authenticate("jwt", {session: false}), (req, res) => {
  // Malachi commented these out, sorry.
  // const { errors, isValid } = validateCollectionInput(req.body);
  // if (!isValid) { return res.status(400).json(errors); };

  Collection
    .findById(req.body._id)
    .then(collection => {
      if (!collection) {
        return res.status(404).json(errors);
      } else {
        collection.title = req.body.title,
        collection.description = req.body.description,
        collection.wines = req.body.wines
        collection.save()
      }
    })
});

// delete collection
router.delete("/:id", passport.authenticate("jwt", { session: false }), (req, res) => {
  Collection 
    .findByIdAndDelete(req.params.id)
    .then(collection => res.json(collection))
    .catch(err => res.status(404).json(err))
});

module.exports = router;