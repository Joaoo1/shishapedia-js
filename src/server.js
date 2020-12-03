// This is separated to not start the server on tests
import 'dotenv/config';
import app from './app';

app.listen(process.env.PORT);
