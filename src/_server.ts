import Admin from '@/_admin';
import controllers from '@/admin';
import App from '@/app';
import validateEnv from '@/utils/validateEnv';

function bootstrap() {
  validateEnv();
  const app = new Admin({ controllers });
  app.listen();
}

bootstrap();
