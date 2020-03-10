import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';
import Notification from '../schemas/Notification';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: {
        model: User,
        as: 'provider',
        attributes: ['id', 'name'],
        include: {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url'],
        },
      },
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Failed' });
    }

    const { provider_id, date } = req.body;

    /**
     * check if provider_id is a real provider
     */

    const isProvider = await User.findOne({
      where: {
        id: provider_id,
        provider: true,
      },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Cannot make appointment with non provider users' });
    }

    /**
     * checks if it's a past date;
     */

    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: { invalid_date: 'Past Date' } });
    }

    /**
     * checks if there's no appointments for that time
     */

    const availability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (availability) {
      return res
        .status(400)
        .json({ error: { invalid_date: 'Date not available' } });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      date: hourStart,
      provider_id,
    });

    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'Dia' dd 'de' MMMM', às' HH:mm'h.'",
      { locale: pt }
    );

    /**
     * Notify provider about new appointment
     */
    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json({ appointment });
  }
}

export default new AppointmentController();
