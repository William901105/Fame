import os
import configparser
from io import StringIO

from fame.common.constants import FAME_ROOT
from fame.common.objects import Dictionary


class ConfigObject:

    def __init__(self, filename=None, from_string=''):
        config = configparser.SafeConfigParser({'root': FAME_ROOT}, allow_no_value=True)

        if filename:
            print(os.path.join(FAME_ROOT, "conf", "%s.conf" % filename),'-------------------------------------')
            config.read(os.path.join(FAME_ROOT, "conf", "%s.conf" % filename))
        else:
            from_string = StringIO(from_string)
            config.readfp(from_string)
            from_string.close()

        for section in config.sections():
            setattr(self, section, Dictionary())
            for name in config.options(section):
                try:
                    value = config.getint(section, name)
                except ValueError:
                    try:
                        value = config.getboolean(section, name)
                    except ValueError:
                        value = config.get(section, name)

                getattr(self, section)[name] = value

    def get(self, key):
        try:
            return getattr(self, key)
        except AttributeError:
            return None


def get_fame_config():
    fame_config = ConfigObject(filename="fame").get('fame')
    print("config---------------------------------")
    if fame_config is None:
        fame_config = Dictionary()
        fame_config['mongo_host'] = 'fame.bun-ball.live'
        fame_config['mongo_port'] = 27017
        fame_config['mongo_db'] = 'fame'
        fame_config['auth'] = 'user_password'
        fame_config['remote'] = False
        fame_config['storage_path'] = '%(root)s/storage'
        fame_config['temp_path'] = '%(root)s/temp'
        fame_config['fame_url'] = 'fame.bun-ball.live'

    return fame_config

fame_config = get_fame_config()
