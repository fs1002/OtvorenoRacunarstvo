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

app.use(express.json());
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});


app.get('/datatable', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/datatable.html')); 
});

app.get('/add-team', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/addTeam.html')); 
});

app.get('/delete-team', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/deleteTeam.html')); 
});

app.get('/update-team/:teamId.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/updateTeam.html')); 
});

app.get('/drivers', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/drivers.html')); 
});

app.get('/details/:teamId.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/details.html')); 
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
        
        if (result.rows.length === 0) {
            return res.status(200).json({
              status: 'OK',
              message: 'No matching F1 teams or drivers found',
              data: null
            });
          }
      
          res.status(200).json({
            status: 'OK',
            message: 'Fetched F1 teams',
            data: result.rows
          });
        } catch (err) {
          console.error('Error fetching data from PostgreSQL:', err);
          res.status(500).json({
            status: 'Internal Server Error',
            message: `Error fetching F1 teams: ${err.message}`,
            data: null
          });
        }
});

app.get('/api/download/csv', async (req, res) => {
    const { filter_value, filter_field } = req.query;
    try {
      let query = `SELECT 
                      Team_name, Engine, Licensed_in, Season_entered, Races_entered,
                      Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC,
                      Name, Surname, Nationality, Year_of_birth, Seasons_competed,
                      Driver_Races_entered, Driver_Wins, Driver_Points,
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
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'Not Found',
          message: 'No data to export in CSV format',
          data: null
        });
      }
  
      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(result.rows);
  
      res.header('Content-Type', 'text/csv');
      res.attachment('filtered_data.csv');
      res.status(200).send(csv);
    } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(500).json({
        status: 'Internal Server Error',
        message: `Error generating CSV: ${err.message}`,
        data: null
      });
    }
  });

  app.get('/api/download/json', async (req, res) => {
    const { filter_value, filter_field } = req.query;
    try {
      let query = `SELECT 
                      Team_name, Engine, Licensed_in, Season_entered, Races_entered,
                      Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC,
                      Name, Surname, Nationality, Year_of_birth, Seasons_competed,
                      Driver_Races_entered, Driver_Wins, Driver_Points,
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
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'Not Found',
          message: 'No data to export in JSON format',
          data: null
        });
      }
  
      const jsonData = JSON.stringify(result.rows, null, 2);
  
      res.header('Content-Type', 'application/json');
      res.attachment('filtered_data.json');
      res.status(200).send(jsonData);
    } catch (err) {
      console.error('Error generating JSON:', err);
      res.status(500).json({
        status: 'Internal Server Error',
        message: `Error generating JSON: ${err.message}`,
        data: null
      });
    }
  });


app.post('/api/addNewTeam', async (req, res) => {
    const {
        teamName, engine, licensedIn, seasonEntered,
        driver1Name, driver1Surname, driver1BirthYear, driver1Nationality,
        driver2Name, driver2Surname, driver2BirthYear, driver2Nationality
    } = req.body;

    // Default values
    const wins = 0;
    const podiums = 0;
    const races_entered = 0;
    const points = 0;
    const poles = 0;
    const wdc = 0;
    const wcc = 0;
    const fastest_laps = 0;
    const seasons_competed = 0;
    const driver_wins = 0;
    const driver_podiums = 0;
    const driver_races_entered = 0;
    const driver_points = 0;
    const driver_poles = 0;
    const driver_wdc = 0;
    const driver_fastest_laps = 0;

    try {
        const client = await pool.connect();

        const teamInsertQuery = `
            INSERT INTO teams (Team_name, Engine, Licensed_in, Season_entered, Races_entered, Wins, Points, Poles, Fastest_laps, Podiums, WDC, WCC)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            RETURNING Team_id
        `;
        const teamResult = await client.query(teamInsertQuery, [
            teamName, engine, licensedIn, seasonEntered, races_entered, wins, points, poles, fastest_laps, podiums, wdc, wcc
        ]);
        const teamId = teamResult.rows[0].team_id;

        const driverInsertQuery = `
            INSERT INTO drivers (Name, Surname, Nationality, Year_of_birth, Seasons_competed, Driver_races_entered, Driver_Wins, Driver_Points, Driver_Poles, Driver_Fastest_laps, Driver_Podiums, Driver_WDC, Team_id)
            VALUES 
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13),
            ($14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26)
        `;
        await client.query(driverInsertQuery, [
            driver1Name, driver1Surname, driver1Nationality, driver1BirthYear, seasons_competed, driver_races_entered, driver_wins, driver_points, driver_poles, driver_fastest_laps, driver_podiums, driver_wdc, teamId,
            driver2Name, driver2Surname, driver2Nationality, driver2BirthYear, seasons_competed, driver_races_entered, driver_wins, driver_points, driver_poles, driver_fastest_laps, driver_podiums, driver_wdc, teamId
        ]);

        client.release();
        return res.status(201).json({
            status: 'OK',
            message: 'Team and drivers added successfully!',
            data: null
          });
        } catch (err) {
          console.error('Error adding new team and drivers:', err);
          return res.status(500).json({
            status: 'Internal Server Error',
            message: `Failed to add team and drivers: ${err.message}`,
            data: null
          });
        }
});

app.get('/api/getAllTeams', async (req, res) => {
    try {
      const query = `SELECT Team_id, Team_name FROM teams`;
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        return res.status(404).json({
          status: 'Not Found',
          message: 'No teams found',
          data: null
        });
      }
  
      res.status(200).json({
        status: 'OK',
        message: 'Fetched all teams',
        data: result.rows
      });
    } catch (err) {
      console.error('Error fetching teams:', err);
      res.status(500).json({
        status: 'Internal Server Error',
        message: `Error fetching teams: ${err.message}`,
        data: null
      });
    }
  });

app.delete('/api/deleteTeam/:teamId', async (req, res) => {
    const teamId = req.params.teamId;
  
    try {
      const client = await pool.connect();
  
      const deleteDriversQuery = `DELETE FROM drivers WHERE Team_id = $1`;
      await client.query(deleteDriversQuery, [teamId]);
  
      const deleteTeamQuery = `DELETE FROM teams WHERE Team_id = $1`;
      const deleteResult = await client.query(deleteTeamQuery, [teamId]);
  
      client.release();
  
      if (deleteResult.rowCount === 0) {
        return res.status(404).json({
          status: 'Not Found',
          message: 'Team not found or already deleted',
          data: null
        });
      }
  
      return res.status(200).json({
        status: 'OK',
        message: 'Team and drivers deleted successfully!',
        data: null
      });
    } catch (err) {
      console.error('Error deleting team and drivers:', err);
      res.status(500).json({
        status: 'Internal Server Error',
        message: `Failed to delete team and drivers: ${err.message}`,
        data: null
      });
    }
  });

  app.put('/api/updateTeam/:teamId', async (req, res) => {
    const { teamId } = req.params;
    const updates = req.body; 
  
    try {
      const client = await pool.connect();
  

      const fieldsToUpdate = Object.keys(updates);
      if (fieldsToUpdate.length === 0) {
        client.release();
        return res.status(400).json({
          status: 'Bad Request',
          message: 'No valid fields provided to update',
          data: null,
        });
      }
  
      const setClauses = fieldsToUpdate.map((field, idx) => `${field} = $${idx + 1}`);
      const values = fieldsToUpdate.map((field) => updates[field]);
  
      const query = `
        UPDATE teams
        SET ${setClauses.join(', ')}
        WHERE team_id = $${fieldsToUpdate.length + 1}
        RETURNING team_id
      `;
      values.push(teamId);
  
      const result = await client.query(query, values);
      client.release();
  
      if (result.rowCount === 0) {
        return res.status(404).json({
          status: 'Not Found',
          message: 'Team not found',
          data: null,
        });
      }
  
      res.status(200).json({
        status: 'OK',
        message: 'Team updated successfully',
        data: null,
      });
    } catch (err) {
      console.error('Error updating team:', err);
      res.status(500).json({
        status: 'Internal Server Error',
        message: `Failed to update team: ${err.message}`,
        data: null,
      });
    }
  });

  app.get('/api/drivers', async (req, res) => {
    try {
      const query = 'SELECT * FROM drivers';
      const result = await pool.query(query);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No drivers found' });
      }
  
      res.status(200).json({ status: 'OK', data: result.rows });
    } catch (err) {
      console.error('Error fetching drivers:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/details/:teamId', async (req, res) => {
    const { teamId } = req.params;
  
    try {
      const query = `
        SELECT * FROM teams WHERE team_id = $1
      `;
      const result = await pool.query(query, [teamId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({status: 'Not Found', message: 'Team not found' });
      }
  
      res.status(200).json({ status: 'OK', data: result.rows[0] });
    } catch (err) {
      console.error('Error fetching team details:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/download/openapi', (req, res) => {

    res.download(path.join(__dirname, 'openapi.json'), 'openapi.json', (err) => {
      if (err) {
        console.error('Error downloading openapi.json:', err);
      }
    });
  });


app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});