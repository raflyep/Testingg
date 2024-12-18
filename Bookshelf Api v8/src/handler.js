const { nanoid } = require("nanoid");
const books = require('./books');

const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage} = request.payload;

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }
    
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    

    const id = nanoid(16);
    const isReading = false;    
    const finished = readPage === pageCount;    
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,  
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,      
        reading: isReading,        
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;
    
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }    

    const response = h.response({
        status: "fail",
        message: "Buku gagal ditambahkan",
      });
      response.code(400);
      return response;
      
};

const getBookHandler = (request) => {
    const { name } = request.params;

    let filterBook = books;

    if (name) {
        const nameLowerCase = name.toLowerCase();
        filterBook = filterBook.filter((book) => book.name.toLowerCase().includes(nameLowerCase));
    }
    
    const getAllBook = filterBook.map(({ id, name, publisher }) => ({
        id,
        name,
        publisher
    }));

    return {
        status: 'success',
        data: {
            books: getAllBook
        },
    };
};

const getBookByIdHandler = (request, h) => {
    const {id} = request.params;

    const book = books.find((n) => n.id === id);

    if (book) {
        
        return {            
            status: "success",
            data: {
                book,
            },      
            message: "Buku ditemukan",
                
        };
    }

    console.log('Book not found');
    const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
        
      });
      response.code(404);
      return response;
};

const editBookByIdHandler = (request, h) => {    
    const {id} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage} = request.payload;
    const finished = readPage === pageCount;  
    const reading = false;
    const updatedAt = new Date().toISOString();

    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        response.code(400);
        return response;
    }

    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        response.code(400);
        return response;
    }

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            updatedAt,
        }

        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};
    
const deleteBookByIdHandler = (request, h) => {
    const {id} = request.params; 

    const index = books.findIndex((book) => book.id === id);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

module.exports = {addBookHandler, getBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};