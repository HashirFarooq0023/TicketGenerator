
const index = (req, res) => {
    res.render('index', { title: "Home " });
};

const showAboutpage = (req, res) => {
    res.render('about', { title: "About Us " });
};

const showContact = (req, res) => {
    res.render('contact', { title: "Contact Us " });
};


module.exports = {
    index,
    showAboutpage,
    showContact,
}