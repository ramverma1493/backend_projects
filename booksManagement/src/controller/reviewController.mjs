import { reviewModel } from "../models/reviewModel.mjs"
import { bookModel } from "../models/bookModel.mjs"
import mongoose from 'mongoose'

const addReview = async (req, res) => {
    try {
        let data = req.body
        if (!data) {
            return res.status(400).send({ message: "please provide review details" })
        }
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ message: "please provide bookId" })
        }

        if(mongoose.Types.ObjectId.isValid(bookId) == false) {
            return res.status(400).send({ message: "Invalid bookId" });
        }

        let book = await bookModel.findById(bookId)

        if (!book || book.isDeleted == true) {
            return res.status(400).send({ status: "fail", message: "no book is present" })
        }


        let review = await reviewModel.create({ ...data, bookId: bookId })
        book.reviews += 1
        await book.save()

        return res.status(201).send({ status: "success", data: review })
    } catch (err) {
        if (err.message.includes('validation')) {
            return res.status(400).send({ message: err.message })
        } else if (err.message.includes('dublicate')) {
            return res.status(400).send({ message: err.message })
        } else {
            return res.status(500).send({ message: err.message })
        }
    }
}

const updateReview = async (req, res) => {
    try {
        let { bookId, reviewId } = req.params
        let book = await bookModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(400).send({ status: "fail", message: "no book with review is present" })
        }
        let reviews = await reviewModel.findById(reviewId)
        if (!reviews || reviews.isDeleted == true) {
            return res.status(400).send({ status: "fail", message: "no review is present" })
        }

        if(reviews.bookId.toString() !== bookId) {
            return res.status(400).send({ status: "fail", message: "this review is not present for this book" })
        }

        let {reviewedBy, rating, review} = req.body
        let reviewData = {}
        if(reviewedBy) {
            reviewData.reviewedBy = reviewedBy
        }
        if(rating) {
            reviewData.rating = rating
        }
        if(review) {
            reviewData.review = review
        }
        let updatedReview = await reviewModel.findByIdAndUpdate(reviewId, reviewData, { new: true })
        return res.status(200).send({ status: "success", data: updatedReview })
    } catch (err) {
        if (err.message.includes('validation')) {
            return res.status(400).send({ status: "400", message: err.message })
        } else if (err.message.includes('dublicate')) {
            return res.status(400).send({status: "400 2", message: err.message })
        } else {
            return res.status(500).send({status: "500", message: err.message })
        }
    }
}

const deleteReviewById = async (req, res) => {
    try {
        let { bookId, reviewId } = req.params
        if(mongoose.Types.ObjectId.isValid(bookId) == false) {
            return res.status(400).send({ message: "Invalid bookId" });
        }
        if(mongoose.Types.ObjectId.isValid(reviewId) == false) {
            return res.status(400).send({ message: "Invalid reviewId" });
        }
        let review = await reviewModel.findById(reviewId)
        let book = await bookModel.findById(bookId)
        if (!book || book.isDeleted == true) {
            return res.status(400).send({ status: "fail", message: "no book with review is present" })
        }
        if (!review || review.isDeleted == true) {
            return res.status(400).send({ status: "fail", message: "no review is present" })
        }
        if(review.bookId.toString() !== bookId) {
            return res.status(400).send({ status: "fail", message: "this review is not present for this book" })
        }
        review.isDeleted = true
        await review.save()
        book.reviews -= 1
        await book.save()
        return res.status(200).send({ status: "success", message: "review deleted successfully" })
    } catch (error) {
        return res.status(500).send({ message: 'failed ID', error: err.message })
    }
}

export { addReview, updateReview, deleteReviewById }