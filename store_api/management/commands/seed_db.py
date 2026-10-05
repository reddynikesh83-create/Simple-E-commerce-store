from django.core.management.base import BaseCommand
from store_api.seed_data import seed_database
from store_api.models import Product

class Command(BaseCommand):
    help = 'Seeds the database with initial catalog products and reviews.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-seeding even if products already exist',
        )

    def handle(self, *args, **options):
        force = options.get('force', False)
        if force:
            Product.objects.all().delete()
            self.stdout.write(self.style.WARNING('Cleared existing products.'))

        count = seed_database(force=force)
        self.stdout.write(
            self.style.SUCCESS(f'Successfully seeded database. Total catalog items: {Product.objects.count()}')
        )
