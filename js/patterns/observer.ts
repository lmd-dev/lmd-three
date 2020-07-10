interface Observer
{
	/**
	 * Fonction de notification appelée par les sujets de l'observateur
	 */
    notify(data: any);
}