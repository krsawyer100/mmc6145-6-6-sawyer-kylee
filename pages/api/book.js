import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(  async function handler(req, res) {
  if (!req.session.user) {
    return res.status(401).end()
  }

  try {
    switch(req.method) {
      case 'POST':
        const addedBook = await db.book.add(req.session.user.id, req.body)
        if (!addedBook) {
          req.session.destroy()
          return res.status(401).end()
        }
        return res.status(200).end()
      case 'DELETE':
        const removedBook = await db.book.remove(req.session.user.id, req.body.id)
        if (!removedBook) {
          req.session.destroy()
          return res.status(401).end()
        }
        return res.status(200).end()
      default:
        return res.status(404).end()
    }
  } catch (error) {
    console.error(error)
    return res.status(400).json({error: error.message})
  }
    // TODO: On a POST request, add a book using db.book.add with request body 
    // TODO: On a DELETE request, remove a book using db.book.remove with request body 
    // TODO: Respond with 404 for all other requests
    // User info can be accessed with req.session
    // No user info on the session means the user is not logged in
  },
  sessionOptions
)
