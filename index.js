const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLList,
} = require("graphql");
let { data } = require("./airlines.js");
console.log(data[1]);
const app = express();

const authorType = new GraphQLObjectType({
  name: "author",
  description: "respresents the authors",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(GraphQLString),
      resolve: (author) => {
        return books
          .filter((b) => b.authorId === author.id)
          .map((book) => book.name);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "root query",
  fields: () => ({
    entries: {
      type: new GraphQLList(EntryType),
      description: "list data of airports per a particular month",
      resolve: () => data,
    },
  }),
});

const EntryType = new GraphQLObjectType({
  name: "entry",
  description: "represents an airport data per a particular months",
  fields: () => ({
    Airport: { type: AirportType },
    Time: { type: TimeType },
    Statistics: { type: StatisticsType },
    //Carriers : CarrierType,
  }),
});

const AirportType = new GraphQLObjectType({
  name: "airport",
  description: "represents an airport",
  fields: () => ({
    Code: { type: GraphQLNonNull(GraphQLString) },
    Name: { type: GraphQLNonNull(GraphQLString) },
  }),
});

const TimeType = new GraphQLObjectType({
  name: "timeDetails",
  description: "represents the month/year of entry",
  fields: () => ({
    Label: { type: GraphQLNonNull(GraphQLString) },
    Month: { type: GraphQLNonNull(GraphQLInt) },
    MonthName: {
      type: GraphQLNonNull(GraphQLString),
      description: "Month Name",
      resolve: (parent) => parent["Month Name"],
    },
    Year: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const StatisticsType = new GraphQLObjectType({
  name: "statistics",
  description: "represents the month/year carrier statistics",
  fields: () => ({
    NumberOfDelays: {
      type: NumberOfDelaysType,
      resolve: (parent) => parent["# of Delays"],
    },
    Carriers: { type: CarriersType },
    Flights: { type: StatisticsFlightsType },
    MinutesDelayed: {
      type: MinutesDelayedType,
      resolve: (parent) => parent["Minutes Delayed"],
    },
  }),
});

const MinutesDelayedType = new GraphQLObjectType({
  name: "minutesDelayed",
  description: "minutes delayed because of different reasons",
  fields: () => ({
    Carrier: { type: GraphQLNonNull(GraphQLString) },
    Security: { type: GraphQLNonNull(GraphQLString) },
    Total: { type: GraphQLNonNull(GraphQLString) },
    Weather: { type: GraphQLNonNull(GraphQLString) },
    LateAircraft: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent["National Aviation System"],
    },
    NationalAviationSystem: {
      type: GraphQLNonNull(GraphQLString),
      resolve: (parent) => parent["National Aviation System"],
    },
  }),
});

const StatisticsFlightsType = new GraphQLObjectType({
  name: "StatisticsFlightDelays",
  description: "represents flight delay statistis",
  fields: () => ({
    Cancelled: { type: GraphQLNonNull(GraphQLInt) },
    Delayed: { type: GraphQLNonNull(GraphQLInt) },
    Diverted: { type: GraphQLNonNull(GraphQLInt) },
    Total: { type: GraphQLNonNull(GraphQLInt) },
    OnTime: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (parent) => parent["On Time"],
    },
  }),
});
const CarriersType = new GraphQLObjectType({
  name: "carriers",
  description: "list of aircraft carriers",
  fields: () => ({
    Names: {
      type: GraphQLList(GraphQLString),
      resolve: (parent) => parent.Names.split(","),
    },
    Total: { type: GraphQLNonNull(GraphQLInt) },
  }),
});

const NumberOfDelaysType = new GraphQLObjectType({
  name: "NumberOfDelays",
  fields: () => ({
    Carrier: { type: GraphQLNonNull(GraphQLInt) },
    Security: { type: GraphQLNonNull(GraphQLInt) },
    Weather: { type: GraphQLNonNull(GraphQLInt) },
    LateAircraft: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (parent) => parent["Late Aircraft"],
    },
    NationalAviationSystem: {
      type: GraphQLNonNull(GraphQLInt),
      resolve: (parent) => parent["National Aviation System"],
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addBook: {
      type: BookType,
      description: "Add a book type",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        authorId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        console.log(args);
        const book = {
          id: books.length + 1,
          name: args.name,
          authorId: args.authorId,
        };
        books.push(book);
        return book;
      },
    },
    addAuthor: {
      type: authorType,
      description: "Add a author type",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
      },
      resolve: (parent, args) => {
        const author = {
          name: args.name,
          id: authors.length + 1,
        };
        authors.push(author);
        return author;
      },
    },
  }),
});
const schema = new GraphQLSchema({
  query: RootQueryType,
});
app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
  })
);
app.listen(5000, () => console.log("server running"));
