import mongoose from "mongoose"

let reviewSchema = new mongoose.Schema({
    bookId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'book',
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: 'Guest'
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        minLength: 1,
        maxLength: 5,
        required: true
    },
    review: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
})

let reviewModel = mongoose.model('review', reviewSchema)
export {reviewModel}