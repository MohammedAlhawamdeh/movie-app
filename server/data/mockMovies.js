// Mock movie data to use when TMDB API is not available
const mockMovies = {
  trending: [
    {
      id: 1,
      title: "Inception",
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      release_date: "2010-07-16",
      vote_average: 8.4,
      genre_ids: [28, 53, 878]
    },
    {
      id: 2,
      title: "The Shawshank Redemption",
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      release_date: "1994-09-23",
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 3,
      title: "The Godfather",
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop_path: "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
      release_date: "1972-03-14",
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 4,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      release_date: "2008-07-16",
      vote_average: 8.5,
      genre_ids: [28, 80, 18]
    },
    {
      id: 5,
      title: "Pulp Fiction",
      overview: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine in four tales of violence and redemption.",
      poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
      backdrop_path: "/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg",
      release_date: "1994-10-14",
      vote_average: 8.5,
      genre_ids: [53, 80]
    },
    {
      id: 6,
      title: "The Matrix",
      overview: "A computer hacker learns about the true nature of reality and his role in the war against its controllers.",
      poster_path: "/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg",
      backdrop_path: "/fNG7i7RqMErkcqhohV2a6cV1Ehy.jpg",
      release_date: "1999-03-31",
      vote_average: 8.2,
      genre_ids: [28, 878]
    },
    {
      id: 7,
      title: "Fight Club",
      overview: "An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      backdrop_path: "/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg",
      release_date: "1999-10-15",
      vote_average: 8.4,
      genre_ids: [18, 53]
    },
    {
      id: 8,
      title: "Forrest Gump",
      overview: "The presidencies of Kennedy and Johnson, the events of Vietnam, Watergate, and other historical events unfold through the perspective of an Alabama man with an IQ of 75.",
      poster_path: "/clolk7rB5lAjs41SD0Vt6IXYLMm.jpg",
      backdrop_path: "/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg",
      release_date: "1994-07-06",
      vote_average: 8.5,
      genre_ids: [35, 18, 10749]
    },
    {
      id: 9,
      title: "Star Wars: Episode V - The Empire Strikes Back",
      overview: "After the Rebels are brutally overpowered by the Empire on the ice planet Hoth, Luke Skywalker begins Jedi training with Yoda, while his friends are pursued by Darth Vader.",
      poster_path: "/2l05cFWJacyIsTpsqSgH0wQXe4V.jpg",
      backdrop_path: "/dMZxEdrWIzUmUoOz2zvmFuutbj7.jpg",
      release_date: "1980-05-20",
      vote_average: 8.4,
      genre_ids: [12, 28, 878]
    },
    {
      id: 10,
      title: "The Lord of the Rings: The Return of the King",
      overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      backdrop_path: "/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg",
      release_date: "2003-12-17",
      vote_average: 8.5,
      genre_ids: [12, 14, 28]
    }
  ],
  popular: [
    {
      id: 11,
      title: "Avatar",
      overview: "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
      poster_path: "/jRXYjXNq0Cs2TcJjLkki24MLp7u.jpg",
      backdrop_path: "/o0s4XsEDfDlvit5pDRKjzXR4pp2.jpg",
      release_date: "2009-12-18",
      vote_average: 7.8,
      genre_ids: [28, 12, 14, 878]
    },
    {
      id: 12,
      title: "Titanic",
      overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.",
      poster_path: "/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
      backdrop_path: "/3WjbxaqYh4hEqHvqFGK5m5ird6G.jpg",
      release_date: "1997-12-19",
      vote_average: 7.9,
      genre_ids: [18, 10749]
    },
    {
      id: 13,
      title: "Jurassic Park",
      overview: "During a preview tour, a theme park suffers a major power breakdown that allows its cloned dinosaur exhibits to run amok.",
      poster_path: "/9i3plLl89DHMz7mahksDaAo7HIS.jpg",
      backdrop_path: "/6z9yBgbQCQKHgYkJQQQfppNFbzZ.jpg",
      release_date: "1993-06-11",
      vote_average: 8.1,
      genre_ids: [12, 878, 53]
    },
    {
      id: 14,
      title: "The Lion King",
      overview: "After the murder of his father, a young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery.",
      poster_path: "/sKCr78MXSLixwmZ8DyJLm95Gq6h.jpg",
      backdrop_path: "/wXsQvli6tWqja8cci5ZlRnP1lRy.jpg",
      release_date: "1994-06-24",
      vote_average: 8.3,
      genre_ids: [16, 10751, 18]
    },
    {
      id: 10,
      title: "The Lord of the Rings: The Return of the King",
      overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      backdrop_path: "/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg",
      release_date: "2003-12-17",
      vote_average: 8.5,
      genre_ids: [12, 14, 28]
    },
    {
      id: 1,
      title: "Inception",
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      release_date: "2010-07-16",
      vote_average: 8.4,
      genre_ids: [28, 53, 878]
    }
  ],
  top_rated: [
    {
      id: 2,
      title: "The Shawshank Redemption",
      overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
      poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
      backdrop_path: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
      release_date: "1994-09-23",
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 3,
      title: "The Godfather",
      overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      backdrop_path: "/rSPw7tgCH9c6NqICZef4kZjFOQ5.jpg",
      release_date: "1972-03-14",
      vote_average: 8.7,
      genre_ids: [18, 80]
    },
    {
      id: 15,
      title: "Schindler's List",
      overview: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
      poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
      backdrop_path: "/loRmLlI3RkmbUCBPWCKbmPvbUnp.jpg",
      release_date: "1993-12-15",
      vote_average: 8.6,
      genre_ids: [18, 36, 10752]
    },
    {
      id: 4,
      title: "The Dark Knight",
      overview: "Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.",
      poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
      backdrop_path: "/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg",
      release_date: "2008-07-16",
      vote_average: 8.5,
      genre_ids: [28, 80, 18]
    },
    {
      id: 10,
      title: "The Lord of the Rings: The Return of the King",
      overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.",
      poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
      backdrop_path: "/8BPZO0Bf8TeAy8znF43z8soK3ys.jpg",
      release_date: "2003-12-17",
      vote_average: 8.5,
      genre_ids: [12, 14, 28]
    }
  ],
  now_playing: [
    {
      id: 16,
      title: "Dune",
      overview: "Feature adaptation of Frank Herbert's science fiction novel, about the son of a noble family entrusted with the protection of the most valuable asset and most vital element in the galaxy.",
      poster_path: "/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
      backdrop_path: "/jYEW5xZkZk2WTrdbMGAPFuBqbDc.jpg",
      release_date: "2021-10-22",
      vote_average: 8.0,
      genre_ids: [878, 12]
    },
    {
      id: 17,
      title: "No Time to Die",
      overview: "Bond has left active service and is enjoying a tranquil life in Jamaica. His peace is short-lived when his old friend Felix Leiter from the CIA turns up asking for help.",
      poster_path: "/iUgygt3fscRoKWCV1d0C7FbM9TP.jpg",
      backdrop_path: "/r2GAjd4rNOHJh6i6Y0FntmYuPQW.jpg",
      release_date: "2021-10-08",
      vote_average: 7.5,
      genre_ids: [28, 12, 53]
    },
    {
      id: 18,
      title: "Venom: Let There Be Carnage",
      overview: "After finding a host body in investigative reporter Eddie Brock, the alien symbiote must face a new enemy, Carnage, the alter ego of serial killer Cletus Kasady.",
      poster_path: "/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg",
      backdrop_path: "/vIgyYkXkg6NC2whRbYjBD7eb3Er.jpg",
      release_date: "2021-10-01",
      vote_average: 7.1,
      genre_ids: [878, 28, 12]
    },
    {
      id: 19,
      title: "Shang-Chi and the Legend of the Ten Rings",
      overview: "Shang-Chi must confront the past he thought he left behind when he is drawn into the web of the mysterious Ten Rings organization.",
      poster_path: "/1BIoJGKbXjdFDAqUEiA2VHqkK1Z.jpg",
      backdrop_path: "/cinER0ESG0eJ49kXlExM0MEWGxW.jpg",
      release_date: "2021-09-03",
      vote_average: 7.8,
      genre_ids: [28, 12, 14]
    },
    {
      id: 20,
      title: "Halloween Kills",
      overview: "Minutes after Laurie Strode, her daughter Karen and granddaughter Allyson left masked monster Michael Myers caged and burning in Laurie's basement, Laurie is rushed to the hospital with life-threatening injuries, believing she finally killed her lifelong tormentor.",
      poster_path: "/qmJGd5IfURq8iPQ9KF3les47vFS.jpg",
      backdrop_path: "/fqw8nJEPvVx2G8gG4ZfZx9lsFgd.jpg",
      release_date: "2021-10-15",
      vote_average: 6.9,
      genre_ids: [27, 53]
    }
  ],
  upcoming: [
    {
      id: 21,
      title: "The Matrix Resurrections",
      overview: "The next installment in the franchise follows Neo who is living a normal life in San Francisco when Morpheus offers him the red pill and reopens his mind to the Matrix world.",
      poster_path: "/8c4a8kE7PizaGQQnditMmI1xbRp.jpg",
      backdrop_path: "/gGTRUThJJDEzS2h9e2mgV3CWAT.jpg",
      release_date: "2021-12-22",
      vote_average: 7.0,
      genre_ids: [878, 28, 12]
    },
    {
      id: 22,
      title: "Spider-Man: No Way Home",
      overview: "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man.",
      poster_path: "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
      backdrop_path: "/5P8SmMzSNYikXpxil6BYzJ16611.jpg",
      release_date: "2021-12-17",
      vote_average: 8.3,
      genre_ids: [28, 12, 878]
    },
    {
      id: 23,
      title: "The King's Man",
      overview: "As a collection of history's worst tyrants and criminal masterminds gather to plot a war to wipe out millions, one man must race against time to stop them.",
      poster_path: "/aq4Pwv5Xeqj8ai16EUhF1VtVKPT.jpg",
      backdrop_path: "/4OTYefcAlaShn6TGVK33UxLW9R7.jpg",
      release_date: "2021-12-22",
      vote_average: 7.0,
      genre_ids: [28, 12, 53]
    },
    {
      id: 24,
      title: "Ghostbusters: Afterlife",
      overview: "When a single mom and her two kids arrive in a small town, they begin to discover their connection to the original Ghostbusters and the secret legacy their grandfather left behind.",
      poster_path: "/sg4xJaufDiQl7nBc2SYZb0RTgAi.jpg",
      backdrop_path: "/EnDlndEvw6Ptpp8HIwmRcSSNKQ.jpg",
      release_date: "2021-11-19",
      vote_average: 7.3,
      genre_ids: [14, 35, 12]
    },
    {
      id: 25,
      title: "Eternals",
      overview: "The Eternals are a team of ancient aliens who have been living on Earth in secret for thousands of years. When an unexpected tragedy forces them out of the shadows, they are forced to reunite against mankind's most ancient enemy, the Deviants.",
      poster_path: "/bcCBq9N1EMo3daNIjWJ8kYvrQm6.jpg",
      backdrop_path: "/k2twTjyLdG0YbxGOsi7PYTYQdx4.jpg",
      release_date: "2021-11-05",
      vote_average: 7.1,
      genre_ids: [28, 12, 14, 878]
    }
  ],
  movieDetails: {
    1: {
      id: 1,
      title: "Inception",
      tagline: "Your mind is the scene of the crime",
      overview: "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      backdrop_path: "/s3TBrRGB1iav7gFOCNx3H31MoES.jpg",
      release_date: "2010-07-16",
      vote_average: 8.4,
      runtime: 148,
      budget: 160000000,
      revenue: 825532764,
      original_language: "en",
      genres: [
        { id: 28, name: "Action" },
        { id: 53, name: "Thriller" },
        { id: 878, name: "Science Fiction" }
      ],
      videos: {
        results: [
          {
            id: "533ec654c3a36854480003eb",
            key: "YoHD9XEInc0",
            name: "Inception - Official Trailer",
            site: "YouTube",
            type: "Trailer",
            published_at: "2010-05-10T19:37:16.000Z"
          }
        ]
      },
      credits: {
        cast: [
          {
            id: 6193,
            name: "Leonardo DiCaprio",
            character: "Dom Cobb",
            profile_path: "/wo2hJpn04vbtmh0B9utCFdsQhxM.jpg"
          },
          {
            id: 24045,
            name: "Joseph Gordon-Levitt",
            character: "Arthur",
            profile_path: "/4U9G4YwTlLEWjvKBExQZEMZHuNS.jpg"
          },
          {
            id: 27578,
            name: "Ellen Page",
            character: "Ariadne",
            profile_path: "/9Q2rDBZmf8EIBXGg9VQCEsY7CH8.jpg"
          },
          {
            id: 2037,
            name: "Tom Hardy",
            character: "Eames",
            profile_path: "/yVGF9FvDxTDPhGimTbZNfghpllA.jpg"
          },
          {
            id: 3895,
            name: "Ken Watanabe",
            character: "Saito",
            profile_path: "/psYhuwGYXLIFgEgYjKypA3GrHXM.jpg"
          }
        ]
      },
      homepage: "https://www.warnerbros.com/movies/inception/"
    }
  }
};

// This function helps generate results for discover endpoint with filters
const discoverMovies = (options = {}) => {
  // Default values for options
  const {
    with_genres,
    primary_release_year,
    sort_by = 'popularity.desc',
    page = 1,
    limit = 20
  } = options;
  
  // Start with all movies
  let allMovies = [
    ...mockMovies.trending,
    ...mockMovies.popular,
    ...mockMovies.top_rated,
    ...mockMovies.now_playing,
    ...mockMovies.upcoming
  ];
  
  // Remove duplicates by id
  const uniqueIds = new Set();
  allMovies = allMovies.filter(movie => {
    if (uniqueIds.has(movie.id)) return false;
    uniqueIds.add(movie.id);
    return true;
  });
  
  // Apply genre filter if provided
  if (with_genres) {
    allMovies = allMovies.filter(movie => 
      movie.genre_ids.includes(parseInt(with_genres))
    );
  }
  
  // Apply year filter if provided
  if (primary_release_year) {
    const year = primary_release_year.toString();
    allMovies = allMovies.filter(movie => 
      movie.release_date && movie.release_date.startsWith(year)
    );
  }
  
  // Apply sorting
  if (sort_by) {
    const [field, direction] = sort_by.split('.');
    const sortMultiplier = direction === 'desc' ? -1 : 1;
    
    allMovies.sort((a, b) => {
      if (field === 'popularity') {
        return sortMultiplier * (b.vote_average - a.vote_average);
      } else if (field === 'vote_average') {
        return sortMultiplier * (b.vote_average - a.vote_average);
      } else if (field === 'release_date') {
        return sortMultiplier * (new Date(b.release_date) - new Date(a.release_date));
      } else if (field === 'revenue') {
        // Since we don't have real revenue data for all mock movies, use vote_average
        return sortMultiplier * (b.vote_average - a.vote_average);
      }
      return 0;
    });
  }
  
  // Calculate pagination
  const totalResults = allMovies.length;
  const totalPages = Math.ceil(totalResults / limit);
  const startIndex = (page - 1) * limit;
  const results = allMovies.slice(startIndex, startIndex + limit);
  
  return {
    page: parseInt(page),
    results,
    total_pages: totalPages,
    total_results: totalResults
  };
};

// Helper function to get a specific movie's details
const getMovieById = (id) => {
  // First check if we have full movie details
  if (mockMovies.movieDetails[id]) {
    return mockMovies.movieDetails[id];
  }
  
  // If not, look for the movie in our lists
  const allMovies = [
    ...mockMovies.trending,
    ...mockMovies.popular,
    ...mockMovies.top_rated,
    ...mockMovies.now_playing,
    ...mockMovies.upcoming
  ];
  
  const movie = allMovies.find(m => m.id === parseInt(id));
  
  if (!movie) return null;
  
  // Create a basic movie details object
  return {
    ...movie,
    tagline: "No tagline available",
    runtime: 120,
    budget: 0,
    revenue: 0,
    genres: movie.genre_ids.map(id => {
      const genreMap = {
        28: "Action",
        12: "Adventure",
        16: "Animation",
        35: "Comedy",
        80: "Crime",
        99: "Documentary",
        18: "Drama",
        10751: "Family",
        14: "Fantasy",
        36: "History",
        27: "Horror",
        10402: "Music",
        9648: "Mystery",
        10749: "Romance",
        878: "Science Fiction",
        10770: "TV Movie",
        53: "Thriller",
        10752: "War",
        37: "Western"
      };
      return { id, name: genreMap[id] || "Unknown" };
    }),
    videos: { results: [] },
    credits: { cast: [] },
    homepage: ""
  };
};

module.exports = {
  mockMovies,
  discoverMovies,
  getMovieById
};