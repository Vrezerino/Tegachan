## Tegachan (Next.js/MongoDB)

Tegachan is an imageboard type discussion forum. It features dynamic app routing, 
styles that mostly utilize Tailwind CSS, light and dark mode themes, so far four discussion 
boards (Technology, Music, Outdoors, Random), and thread starter and reply posting forms.
Image files that are uploaded with new posts, are hosted on Amazon S3 cloud object storage, 
and the posts themselves are inserted into a MongoDB Atlas document-oriented database.

To run the project on your own computer, install Git CLI, Node.js, and npm (Node package manager).   
https://git-scm.com/book/en/v2/Getting-Started-Installing-Git   
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm   

Then, run these commands on your command-line interface.

```
cd C:\ExamplePath
git clone https://github.com/Vrezerino/Tegachan
cd Tegachan
npm install
npm run dev
```