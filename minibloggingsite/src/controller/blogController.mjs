import { blogModel } from "../models/blogModel.mjs"
import { authorModel } from "../models/authorModel.mjs"
import { isValidObjectId } from "mongoose"

let addBlog = async (req, res) => {
    try {
        //const ObjectId = mongoose.Types.ObjectId
        let data = req.body
        if (!data) {
            return res.status(400).send({ message: 'data is required' })
        }
        let authorId = data.authorId
        if (!authorId) {
            return res.status(400).send({ message: 'authorId is required' })
        }
        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ message: 'Invalid authorId' })
        }
        if (!await authorModel.findById(authorId)) {
            return res.status(400).send({ message: 'Author not available' })
        }
        let blog = await blogModel.create(data)
        blog = await blog.populate('authorId')
        return res.status(201).send({ status: 'success', data: blog })
    } catch (err) {
        if (err.message.includes('dublicate')) {
            return res.status(400).send({ message: "failed", error: err.message })
        } else if (err.message.includes('validation')) {
            return res.status(400).send({ message: "failed", error: err.message })
        }
        return res.status(500).send({ message: "failed", error: err.message })
    }
}

let getBlog = async (req, res) => {
    try {
        let { authorId, category, tag, subCategory } = req.query
        let query = {
            isDeleted: false,
            isPublished: true
        }
        if (authorId) {
            query.authorId = authorId
        }
        if (category) {
            query.category = category
        }
        if (tag) {
            query.tags = tag
        }
        if (subCategory) {
            query.subcategory = subCategory
        }
        let blog = await blogModel.find(query)
        if (blog.length === 0) {
            return res.status(404).send({ status: 'false', message: 'No blog found' })
        }
        return res.status(200).send({ message: 'success', count: blog.length, data: blog })
    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

let updateBlog = async (req, res) => {
    try {
        let { blogId } = req.params
        let { title, body, tags, subcategory, category } = req.body

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ message: 'Invalid blogId' })
        }

        let blogData = await blogModel.findById(blogId)

        if (!blogData) return res.status(404).send({ message: 'Blog not found' })
        if (!blogData.isPublished) return res.status(400).send({ message: 'Blog is not published' })
        if (blogData.isDeleted) return res.status(400).send({ message: 'Blog is deleted' })

        if (tags) {
            if (Array.isArray(tags)) {
            } else if (typeof tags === "string") {
                tags = tags.includes(",") ? tags.split(",") : [tags]
            }
        }

        if (subcategory) {
            if (Array.isArray(subcategory)) {
            } else if (typeof subcategory === "string") {
                subcategory = subcategory.includes(",") ? subcategory.split(",") : [subcategory]
            }
        }

        let data = {}
        if (title) data.title = title
        if (body) data.body = body
        if (category) data.category = category
        data.isPublished = true

        let updateObj = { $set: data }

        if (tags || subcategory) {
            updateObj.$addToSet = {}

            if (tags) {
                updateObj.$addToSet.tags = { $each: tags }
            }

            if (subcategory) {
                updateObj.$addToSet.subcategory = { $each: subcategory }
            }
        }

        let updatedBlog = await blogModel.findByIdAndUpdate(
            blogId,
            updateObj,
            { new: true }
        )

        return res.status(200).send({
            status: true,
            message: "Blog updated successfully",
            data: updatedBlog
        })

    } catch (err) {
        return res.status(500).send({ message: err.message })
    }
}

let deleteBlog = async (req, res) => {
    try {
        let { blogId } = req.params

        if (!blogId) {
            return res.status(404).send({ status: 'false', message: 'No Blog ID given' })
        }

        if (!isValidObjectId(blogId)) {
            return res.status(400).send({ status: 'false', message: 'Invalid Blog ID' })
        }
        let data = req.body

        let blogData = await blogModel.findById(blogId)

        if (!blogData) {
            return res.status(404).send({ status: 'false', message: 'Blog not found' })
        }
        if (blogData.isDeleted) {
            return res.status(404).send({ status: 'false', message: 'Blog is already deleted' })
        }

        let updatedBlog = await blogModel.findByIdAndUpdate(blogId, { isDeleted: true })
        return res.status(200).send({ status: 'success', data: updatedBlog })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

let deleteBlogByQuery = async (req, res) => {
    try {
        let { blogId, category, tags, subCategory, unpublished } = req.query
        let data = req.body
        let query = {
            isDeleted: false,
        }

        if (blogId) {
            if (!isValidObjectId(blogId)) {
                return res.status(400).send({ status: 'false', message: 'Invalid Blog ID' })
            }
            query._id = blogId
        }
        if (category) {
            query.category = category
        }
        if (tags) {
            query.tags = { $in: tags.split(',') }
        }
        if (subCategory) {
            query.subcategory = { $in: subCategory.split(',') }
        }
        if (unpublished) {
            query.isPublished = false
        }

        if (Object.keys(query).length === 1) {
            return res.status(404).send({ status: 'false', message: 'add eleement to delete' })
        }

        let blogData = await blogModel.findOne(query)

        if (!blogData) {
            return res.status(404).send({ status: 'false', message: 'Blog not found' })
        }

        let updatedBlog = await blogModel.findOneAndDelete(query)
        return res.status(200).send({ status: 'deleted', data: updatedBlog })
    } catch (err) {
        return res.status(500).send(err.message)
    }
}

export { addBlog, getBlog, updateBlog, deleteBlog, deleteBlogByQuery }