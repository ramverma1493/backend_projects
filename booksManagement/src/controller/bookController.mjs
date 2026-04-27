import { bookModel } from "../models/bookModel.mjs";
import { userModel } from "../models/userModel.mjs";
import { reviewModel } from "../models/reviewModel.mjs";
import mongoose from 'mongoose'

let createBook = async (req, res) => {
    try {
        let bookData = req.body
        if (!bookData) {
            return res.status(400).send({ message: "please provide book details" })
        }
        let userId = bookData.userId
        if (!userId) {
            return res.status(400).send({ message: "please provide userId" })
        }

        if (! await userModel.findById(userId)) {
            return res.status(400).send({ message: "no user is present" })
        }

        let book = await bookModel.create(bookData)
        return res.status(201).send({ message: "success", data: book })
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

const getallBooks = async (req, res) => {
    try {
        let data = { isDeleted: false }
        let { userId, category, subcategory } = req.query
        if (userId) {
            data.userId = userId
        }
        if (category) {
            data.category = category
        }
        if (subcategory) {
            data.subcategory = subcategory
        }
        let books = await bookModel.find(data)
        books.sort((a, b) => a.title.localeCompare(b.title))
        if (books.length == 0) {
            return res.status(404).send({ message: "no books are present" })
        }
        return res.status(200).send({ message: "books found", count: books.length, data: books })
    } catch (err) {
        return res.status(500).send({ message: 'failed', error: err.message })
    }
}

const getBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ message: "Invalid bookId" });
        }

        let book = await bookModel.findById({ _id: bookId, isDeleted: false })
        if (!book) {
            return res.status(404).send({ message: "book not found" })
        }
        let reviews = await reviewModel.find({ bookId: bookId, isDeleted: false })
        if (reviews.length == 0) {
            reviews = []
        }
        book = book.toObject();
        book.reviewsData = reviews
        return res.status(200).send({ message: "book found", data: book })
    } catch (err) {
        return res.status(500).send({ message: 'failed ID', error: err.message })
    }
}

const updateBook = async (req, res) => {
    try {
        let bookId = req.params.bookId
        let { title, excerpt, releasedAt, ISBN } = req.body

        if (!bookId) {
            return res.status(400).send({ message: "please provide bookId" })
        }

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ message: "Invalid bookId" });
        }

        let data = { isDeleted: false }
        if (title) {
            let uniqueTitle = await bookModel.findOne({
                title: title,
                _id: { $ne: bookId }
            })
            if (uniqueTitle) {
                return res.status(400).send({ message: "title already exists" })
            }
            data.title = title
        }
        if (excerpt) {
            let uniqueExcerpt = await bookModel.findOne({
                excerpt: excerpt,
                _id: { $ne: bookId }
            })
            if (uniqueExcerpt) {
                return res.status(400).send({ message: "excerpt already exists" })
            }
            data.excerpt = excerpt
        }
        if (releasedAt) {
            data.releasedAt = releasedAt
        }
        if (ISBN) {
            data.ISBN = ISBN
        }
        let book = await bookModel.findByIdAndUpdate(bookId, data, { new: true })
        if (!book) {
            return res.status(404).send({ status: 'failed', message: "no book by this ID" })
        }
        return res.status(200).send({ message: "book updated", data: book }, { new: true })
    } catch (error) {
        return res.status(500).send({ message: 'failed ID', error: err.message })
    }
}

const deleteBookById = async (req, res) => {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            return res.status(400).send({ message: "please provide bookId" })
        }
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).send({ message: "Invalid bookId" });
        }
        let book = await bookModel.findByIdAndUpdate(
            { _id: bookId, isDeleted: false },
            { isDeleted: true, deletedAt: Date.now() }, { new: true })
        if (!book) {
            return res.status(404).send({ status: 'failed', message: "no book by this ID" })
        }
        return res.status(200).send({ message: "book deleted" })
    } catch (error) {
        return res.status(500).send({ message: 'failed ID', error: err.message })
    }
}

export { createBook, getallBooks, getBookById, updateBook, deleteBookById }



// let getallBooks = async (req, res) => {
//     try {
//         let books = await bookModel.find({ isDeleted: false })
//         let { userId, category, subcategory } = req.query
//         if (userId) {
//             books = books.filter(book => book.userId == userId)
//         }
//         if (category) {
//             books = books.filter(book => book.category == category)
//         }
//         if (subcategory) {
//             books = books.filter(book => book.subcategory == subcategory)
//         }

//         if (books.length == 0) {
//             return res.status(400).send({ message: "no books are present" })
//         }
//         books.sort((a, b) => a.title.localeCompare(b.title))

//         return res.status(200).send({ message: "all books", data: books })
//     } catch (err) {
//         return res.status(500).send({ message: err.message })
//     }
// }