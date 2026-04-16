import mongoose from 'mongoose'

const blogSchema = new mongoose.Schema({

    title: { type: String, required: true },
    body: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'author', required: true },
    tags: [String],
    category: { type: String, required: true },
    subcategory: [String],
    isDeleted: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: false }
}, { timestamps: true, deleteAt: true, publishedAt: true })

let blogModel = mongoose.model('blog', blogSchema)

export { blogModel }