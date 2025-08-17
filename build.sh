#!/bin/bash

# Instal dependensi Python
pip install -r api/requirements.txt

# Jalankan collectstatic untuk mengumpulkan file admin Django
python api/manage.py collectstatic --noinput

# Jalankan migrasi database
python api/manage.py migrate