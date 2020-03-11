import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle(data) {
    const { appointment } = data;

    console.log('Inside CancellationMail.handle()');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento Cancelado',
      template: 'cancellation',
      // could be text, html, etc.. - If there was no template engine
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' HH:mm' horas.'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();
