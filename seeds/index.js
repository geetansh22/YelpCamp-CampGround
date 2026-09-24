const mongoose = require('mongoose')
const cities = require('./cities')
const Campground = require('../models/campground')
const { places, descriptors } = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    //    useCreateIndex: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({title: 'purple field'});
    // await c.save();
    for (let i = 0; i < 100; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.round((Math.random() * 20 + 10) * 100) / 100;
        const camp = new Campground({
            author: '68873d4419634bc288639c98',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: '    Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis officiis repellendus saepe totam voluptatibus quam magnam cum! Harum temporibus perspiciatis incidunt quisquam ex? Harum quia earum tempora. Dolore, aliquam quasi.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dqddm58b9/image/upload/v1755020290/denys-nevozhai-63Znf38gnXk-unsplash_wkiso4.jpg',
                    filename: 'YelpCamp/NightSky',
                },
                // {
                //     url: 'https://res.cloudinary.com/dqddm58b9/image/upload/v1754138865/YelpCamp/qlby3ucbccx9h93sacxq.png',
                //     filename: 'YelpCamp/qlby3ucbccx9h93sacxq',
                // },
                // {
                //     url: 'https://res.cloudinary.com/dqddm58b9/image/upload/v1754138865/YelpCamp/j01uk3gd7kajawgxrtyb.png',
                //     filename: 'YelpCamp/j01uk3gd7kajawgxrtyb',
                // }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();

})
