import os
import platform
from time import time
from urllib.parse import urljoin
from zipfile import ZipFile
from flask import Flask, render_template, url_for, request, flash, send_from_directory, send_file
from flask_classful import FlaskView, route

from web.views.negotiation import render, redirect, validation_error, render_json
from web.views.mixins import UIView
from web.views.helpers import get_or_404, requires_permission, file_download, clean_modules, clean_repositories
from fame.core.module import ModuleInfo
from fame.core.config import Config
from fame.core.repository import Repository

def get_name(module):
    return module['name']


class PreprocessorsView(FlaskView, UIView):
    def index(self):

        types = {
            'Preloading': [],
            'Processing': [],
            'Preprocessing': [],
            'Reporting': [],
            'Threat Intelligence': [],
            'Antivirus': [],
            'Virtualization': [],
            'Filetype': []
        }

        for module in ModuleInfo.get_collection().find():
            types[module['type']].append(clean_modules(module))

        for type in types:
            types[type] = sorted(types[type], key=get_name)


        configs = Config.get_collection().find()

        repositories = clean_repositories(list(Repository.get_collection().find()))

        return render({'modules': types, 'configs': configs, 'repositories': repositories}, 'preprocessors/index.html')

    @route('/<id>/downloadwindows', methods=['POST'])
    def downloadwindows(self, id):
        module = ModuleInfo(get_or_404(ModuleInfo.get_collection(), _id=id))
        path=module['path'].replace(".","/").split('/')
        path.pop()
        file_path=""
        for p in path:
            file_path= os.path.join(file_path, p)
        file_path = os.path.join(file_path, "windows.zip")
        if os.path.exists(file_path):
            return send_file (file_path, as_attachment = True)
        else:
            flash("file doesn't exist.")
            return redirect({'module': clean_modules(module)}, url_for('PreprocessorsView:index'))
    
    @route('/<id>/downloadlinux', methods=['POST'])
    def downloadlinux(self, id):
        module = ModuleInfo(get_or_404(ModuleInfo.get_collection(), _id=id))
        path=module['path'].replace(".","/").split('/')
        path.pop()
        file_path=""
        for p in path:
            file_path= os.path.join(file_path, p)
        file_path = os.path.join(file_path, "linux.zip")
        if os.path.exists(file_path):
            return send_file (file_path, as_attachment = True)
        else:
            flash("file doesn't exist.")
            return redirect({'module': clean_modules(module)}, url_for('PreprocessorsView:index'))
