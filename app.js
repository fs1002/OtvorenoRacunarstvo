const express = require('express');
const app = express();
const path = require('path');
const { Pool } = require('pg');
const { Parser } = require('json2csv');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'F1Teams',
  password: 'admin',
  port: 5432,
});


app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});


app.get('/datatable', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/datatable.html')); 
});



  app.get('/api/F1teams', async (req, res) => {
    const { filter_value, filter_field } = req.query;

    try {
        let query = ` SELECT Team_name, Engine, Licensed_in, Season_entered, Races_entered,
                       Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC,
                       Name, Surname, Nationality, Year_of_birth, Seasons_competed,
                       Driver_Races_entered , Driver_Wins, Driver_Points,
                       Driver_Poles, Driver_Fastest_laps,
                       Driver_Podiums, Driver_WDC
                FROM teams t
                JOIN drivers d ON d.Team_id = t.Team_id`;

        if (filter_field !== 'wildcard') {
            query += ` WHERE CAST(${filter_field} AS TEXT) ILIKE $1`;
        } else {
            query += ` WHERE 
                CAST(t.Team_name AS TEXT) ILIKE $1 OR 
                CAST(t.Engine AS TEXT) ILIKE $1 OR 
                CAST(t.Licensed_in AS TEXT) ILIKE $1 OR 
                CAST(t.season_entered AS TEXT) ILIKE $1 OR
                CAST(t.races_entered AS TEXT) ILIKE $1 OR
                CAST(t.wins AS TEXT) ILIKE $1 OR
                CAST(t.points AS TEXT) ILIKE $1 OR
                CAST(t.poles AS TEXT) ILIKE $1 OR
                CAST(t.fastest_laps AS TEXT) ILIKE $1 OR
                CAST(t.podiums AS TEXT) ILIKE $1 OR
                CAST(t.wdc AS TEXT) ILIKE $1 OR
                CAST(t.wcc AS TEXT) ILIKE $1 OR
                CAST(d.Name AS TEXT) ILIKE $1 OR 
                CAST(d.Surname AS TEXT) ILIKE $1 OR 
                CAST(d.Nationality AS TEXT) ILIKE $1 OR
                CAST(d.year_of_birth AS TEXT) ILIKE $1 OR
                CAST(d.seasons_competed AS TEXT) ILIKE $1 OR
                CAST(d.driver_races_entered AS TEXT) ILIKE $1 OR
                CAST(driver_wins AS TEXT) ILIKE $1 OR
                CAST(driver_points AS TEXT) ILIKE $1 OR
                CAST(driver_poles AS TEXT) ILIKE $1 OR
                CAST(driver_fastest_laps AS TEXT) ILIKE $1 OR
                CAST(driver_podiums AS TEXT) ILIKE $1 OR
                CAST(driver_wdc AS TEXT) ILIKE $1`; 
        }

        const result = await pool.query(query, [`${filter_value}%`]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching data from PostgreSQL:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/download/csv', async (req, res) => {
  const { filter_value, filter_field } = req.query;
  try {
      let query = ` SELECT Team_name, Engine, Licensed_in, Season_entered, Races_entered,
                     Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC,
                     Name, Surname, Nationality, Year_of_birth, Seasons_competed,
                     Driver_Races_entered , Driver_Wins, Driver_Points,
                     Driver_Poles, Driver_Fastest_laps,
                     Driver_Podiums, Driver_WDC
              FROM teams t
              JOIN drivers d ON d.Team_id = t.Team_id`;

      if (filter_field !== 'wildcard') {
          query += ` WHERE CAST(${filter_field} AS TEXT) ILIKE $1`;
      } else {
          query += ` WHERE 
              CAST(t.Team_name AS TEXT) ILIKE $1 OR 
              CAST(t.Engine AS TEXT) ILIKE $1 OR 
              CAST(t.Licensed_in AS TEXT) ILIKE $1 OR 
              CAST(t.season_entered AS TEXT) ILIKE $1 OR
              CAST(t.races_entered AS TEXT) ILIKE $1 OR
              CAST(t.wins AS TEXT) ILIKE $1 OR
              CAST(t.points AS TEXT) ILIKE $1 OR
              CAST(t.poles AS TEXT) ILIKE $1 OR
              CAST(t.fastest_laps AS TEXT) ILIKE $1 OR
              CAST(t.podiums AS TEXT) ILIKE $1 OR
              CAST(t.wdc AS TEXT) ILIKE $1 OR
              CAST(t.wcc AS TEXT) ILIKE $1 OR
              CAST(d.Name AS TEXT) ILIKE $1 OR 
              CAST(d.Surname AS TEXT) ILIKE $1 OR 
              CAST(d.Nationality AS TEXT) ILIKE $1 OR
              CAST(d.year_of_birth AS TEXT) ILIKE $1 OR
              CAST(d.seasons_competed AS TEXT) ILIKE $1 OR
              CAST(d.driver_races_entered AS TEXT) ILIKE $1 OR
              CAST(driver_wins AS TEXT) ILIKE $1 OR
              CAST(driver_points AS TEXT) ILIKE $1 OR
              CAST(driver_poles AS TEXT) ILIKE $1 OR
              CAST(driver_fastest_laps AS TEXT) ILIKE $1 OR
              CAST(driver_podiums AS TEXT) ILIKE $1 OR
              CAST(driver_wdc AS TEXT) ILIKE $1`;
      }

      const result = await pool.query(query, [`${filter_value}%`]);

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(result.rows);

      res.header('Content-Type', 'text/csv');
      res.attachment('filtered_data.csv');
      res.send(csv);
  } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/download/json', async (req, res) => {
  const { filter_value, filter_field } = req.query;
  try {
      let query = ` SELECT Team_name, Engine, Licensed_in, Season_entered, Races_entered,
                     Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC,
                     Name, Surname, Nationality, Year_of_birth, Seasons_competed,
                     Driver_Races_entered , Driver_Wins, Driver_Points,
                     Driver_Poles, Driver_Fastest_laps,
                     Driver_Podiums, Driver_WDC
              FROM teams t
              JOIN drivers d ON d.Team_id = t.Team_id`;

      if (filter_field !== 'wildcard') {
          query += ` WHERE CAST(${filter_field} AS TEXT) ILIKE $1`;
      } else {
          query += ` WHERE 
              CAST(t.Team_name AS TEXT) ILIKE $1 OR 
              CAST(t.Engine AS TEXT) ILIKE $1 OR 
              CAST(t.Licensed_in AS TEXT) ILIKE $1 OR 
              CAST(t.season_entered AS TEXT) ILIKE $1 OR
              CAST(t.races_entered AS TEXT) ILIKE $1 OR
              CAST(t.wins AS TEXT) ILIKE $1 OR
              CAST(t.points AS TEXT) ILIKE $1 OR
              CAST(t.poles AS TEXT) ILIKE $1 OR
              CAST(t.fastest_laps AS TEXT) ILIKE $1 OR
              CAST(t.podiums AS TEXT) ILIKE $1 OR
              CAST(t.wdc AS TEXT) ILIKE $1 OR
              CAST(t.wcc AS TEXT) ILIKE $1 OR
              CAST(d.Name AS TEXT) ILIKE $1 OR 
              CAST(d.Surname AS TEXT) ILIKE $1 OR 
              CAST(d.Nationality AS TEXT) ILIKE $1 OR
              CAST(d.year_of_birth AS TEXT) ILIKE $1 OR
              CAST(d.seasons_competed AS TEXT) ILIKE $1 OR
              CAST(d.driver_races_entered AS TEXT) ILIKE $1 OR
              CAST(driver_wins AS TEXT) ILIKE $1 OR
              CAST(driver_points AS TEXT) ILIKE $1 OR
              CAST(driver_poles AS TEXT) ILIKE $1 OR
              CAST(driver_fastest_laps AS TEXT) ILIKE $1 OR
              CAST(driver_podiums AS TEXT) ILIKE $1 OR
              CAST(driver_wdc AS TEXT) ILIKE $1`;
      }

      const result = await pool.query(query, [`${filter_value}%`]);

      res.header('Content-Type', 'application/json');
      res.attachment('filtered_data.json');
      res.send(JSON.stringify(result.rows, null, 2));
  } catch (err) {
      console.error('Error generating JSON:', err);
      res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});