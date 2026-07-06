import {CannotAccessProjectError} from '../common/errors';
import request from '../common/request';

const getScratchProjectMetadata = async (id) => {
  try {
    const meta = await request({
      url: [
        // Hopefully one of these URLs won't be blocked.
        `https://trampoline.turbowarp.org/api/projects/${id}`,
        `https://trampoline.turbowarp.xyz/api/projects/${id}`
      ],
      type: 'json'
    });
    return {
      title: meta.title,
      token: meta.project_token
    };
  } catch (e) {
    if (e && e.status === 404) {
      throw new CannotAccessProjectError(`Cannot access project ${id}`);
    }
    throw e;
  }
};

const getProjectMetadata = async (id) => {
  try {
    const meta = await request({
      url: `https://api.dashblocks.org/projects/${id}`,
      type: 'json'
    });
    return meta?.project;
  } catch (e) {
    if (e && e.status === 404) {
      throw new CannotAccessProjectError(`Cannot access project ${id}`);
    }
    throw e;
  }
};

export {
  getScratchProjectMetadata,
  getProjectMetadata
};
