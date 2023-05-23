const express = require('express');
const fs = require('fs');
const app = express();
const booksFilePath = 'books.json';
const encoding = 'utf8';

// Créer le fichier JSON s'il n'existe pas
const booksData = [
    {
        id: '1',
        title: 'One Piece tome 74',
        author: 'Eiichirō Oda',
        price: 6.99,
        description: 'Description de one piece'
    },
    {
        id: '2',
        title: 'One piece tome 104',
        author: 'Eiichirō Oda',
        price: 7.99,
        description: 'Description du One piece'
    },

    {
        id: '3',
        title: 'One piece tome 1',
        author: 'Eiichirō Oda',
        price: 3.99,
        description: 'Description du One piece'
    },
    {
        id: '4',
        title: 'One piece tome 35',
        author: 'Eiichirō Oda',
        price: 4.99,
        description: 'Description du One piece'
    }
  ];

// -----------------------------------------------------------------------
  
  if (!fs.existsSync(booksFilePath)) {
    fs.writeFileSync(booksFilePath, JSON.stringify(booksData), encoding);
    console.log('Le fichier JSON a été créé avec succès !');
  } else {
    console.log('Le fichier JSON existe déjà.');
  }
  
app.use(express.json());

// -----------------------------------------------------------------------

// Afficher tous les livres
app.get('/books', (req, res) => {
    fs.readFile(booksFilePath, encoding, (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        } else {
        const books = JSON.parse(data);
        res.json(books);
        }
    });
});

// -----------------------------------------------------------------------

// Afficher livre avec id
app.get('/books/:id', (req, res) => {
    const bookId = req.params.id;
    fs.readFile(booksFilePath, encoding, (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        } else {
        const books = JSON.parse(data);
        const book = books.find((book) => book.id === bookId);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Livre non trouvé');
        }
        }
    });
});

// -----------------------------------------------------------------------

// Afficher livre avec titre
app.get('/books/search/:title', (req, res) => {
    const bookName = req.params.name;
    fs.readFile(booksFilePath, encoding, (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        } else {
        const books = JSON.parse(data);
        const book = books.find((book) => book.title.toLowerCase() === bookName.toLowerCase());
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Livre non trouvé');
        }
        }
    });
});

// -----------------------------------------------------------------------

// Ajouter livre
app.post('/books', (req, res) => {
    const newBook = req.body;
    fs.readFile(booksFilePath, encoding, (err, data) => {
        if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
        } else {
        const books = JSON.parse(data);
        books.push(newBook);
        fs.writeFile(booksFilePath, JSON.stringify(books), encoding, (err) => {
            if (err) {
            console.error(err);
            res.status(500).send('Erreur serveur');
            } else {
            res.json(newBook);
            }
        });
        }
    });
});

// -----------------------------------------------------------------------

// Modifier livre
app.put('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const updatedBook = req.body;
    fs.readFile(booksFilePath, encoding, (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
      } else {
        let books = JSON.parse(data);
        const bookIndex = books.findIndex((book) => book.id === bookId);
        if (bookIndex !== -1) {
          books[bookIndex] = { ...books[bookIndex], ...updatedBook };
          fs.writeFile(booksFilePath, JSON.stringify(books), encoding, (err) => {
            if (err) {
              console.error(err);
              res.status(500).send('Erreur serveur');
            } else {
              res.json(books[bookIndex]);
            }
          });
        } else {
          res.status(404).send('Livre non trouvé');
        }
      }
    });
});

// -----------------------------------------------------------------------

// Supprimer livre 
app.delete('/books/:id', (req, res) => {
    const bookId = req.params.id;
    const bookIndex = booksData.findIndex(l => l.id === bookId);
  
    if (bookIndex !== -1) {
      booksData.splice(bookIndex, 1);
      fs.writeFileSync('books.json', JSON.stringify(booksData));
      res.send('Livre supprimé avec succès.');
    } else {
      res.status(404).send('Livre non trouvé.');
    }
  });

// -----------------------------------------------------------------------

const port = 3000;
app.listen(port, () => {
  console.log(`Démarage du serveur réalisé avec succès sur le port :  ${port}`);
});
