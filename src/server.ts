import controllers from '@/apis';
import App from '@/app';
import validateEnv from '@/utils/validateEnv';

function bootstrap() {
  validateEnv();
  const app = new App({ controllers });
  app.listen();
}

bootstrap();
