import express, { Request, Response }  from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, checkImageURL} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  app.get('/filteredimage', async (req: Request, res: Response) =>{
    try {
      const { image_url }: {image_url: string} = req.query;
      if(!checkImageURL(image_url)){
        res.status(400).json('Invalid Image Url. Please try another image');
        return
      }
      const localImageFilePath: string = await filterImageFromURL(image_url);
      res.status(200).sendFile(localImageFilePath, () =>{
        deleteLocalFiles([localImageFilePath]);
      })
    } catch (error) {
      console.log(error);
      res.status(500).json('Interal Server Error. Please try again');
    }
  })
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();