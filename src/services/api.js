import api from '../api/axios';

export const BASE_URL = `${import.meta.env.VITE_API_URL || 'https://leavebackend-production.up.railway.app'}/api`;

const normalizeError = (error, fallbackMessage) => {
  const message =
    error?.response?.data?.message ||
    error?.message ||
    fallbackMessage;

  const normalized = new Error(message);
  normalized.status = error?.response?.status;
  normalized.data = error?.response?.data;
  normalized.cause = error;
  return normalized;
};

const unsupportedEndpoint = (name) => {
  throw new Error(`${name} is not available because the backend does not currently expose a matching API route.`);
};

export const getLeaveRequests = async (options = {}) => {
  const { scope = 'my' } = options;

  try {
    switch (scope) {
      case 'my': {
        const { data } = await api.get('/leaves/my');
        return data;
      }
      case 'advisorPending': {
        const { data } = await api.get('/advisor/leaves');
        return data;
      }
      case 'advisorAll': {
        const { data } = await api.get('/advisor/leaves/all');
        return data;
      }
      case 'hodPending': {
        const { data } = await api.get('/hod/leaves/pending');
        return data;
      }
      case 'hodAll': {
        const { data } = await api.get('/hod/leaves');
        return data;
      }
      default:
        throw new Error(`Unsupported leave request scope: ${scope}`);
    }
  } catch (error) {
    throw normalizeError(error, 'Failed to fetch leave requests.');
  }
};

export const createLeaveRequest = async (payload) => {
  try {
    const { data } = await api.post('/leaves/apply', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return data;
  } catch (error) {
    throw normalizeError(error, 'Failed to create leave request.');
  }
};

export const updateLeaveStatus = async ({
  id,
  status,
  reviewer = 'advisor',
  remarks,
}) => {
  try {
    if (!id) {
      throw new Error('Leave request id is required.');
    }

    if (!['approved', 'rejected'].includes(status)) {
      throw new Error('status must be "approved" or "rejected".');
    }

    if (!['advisor', 'hod'].includes(reviewer)) {
      throw new Error('reviewer must be "advisor" or "hod".');
    }

    const action = status === 'approved' ? 'approve' : 'reject';
    const { data } = await api.put(`/${reviewer}/leaves/${id}/${action}`, { remarks }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    throw normalizeError(error, 'Failed to update leave status.');
  }
};

export const getEmployees = async ({ role = 'hod' } = {}) => {
  try {
    switch (role) {
      case 'hod': {
        const { data } = await api.get('/hod/students');
        return data;
      }
      case 'advisor': {
        const { data } = await api.get('/advisor/students');
        return data;
      }
      default:
        throw new Error(`Unsupported employee role scope: ${role}`);
    }
  } catch (error) {
    throw normalizeError(error, 'Failed to fetch employees.');
  }
};

export const getAttendance = async () => {
  try {
    const { data } = await api.get('/attendance');
    return data;
  } catch (error) {
    throw normalizeError(error, 'Failed to fetch attendance.');
  }
};

export const getLeaveTypes = async () => {
  try {
    const { data } = await api.get('/leaves/types');
    return data;
  } catch (error) {
    throw normalizeError(error, 'Failed to fetch leave types.');
  }
};

export const getLeaveBalance = async () => {
  try {
    const { data } = await api.get('/leaves/balance');
    return data;
  } catch (error) {
    throw normalizeError(error, 'Failed to fetch leave balance.');
  }
};
